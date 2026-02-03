"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { loginSchema, registerSchema } from "@/features/auth/schemas"
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies"
import { loginWithCredentials, registerWithCredentials, logout as serviceLogout } from "@/lib/auth/service"
import { routes } from "@/lib/routes"

export type ActionResult = { error: string | null; success: boolean }

// Simple in-memory rate limiting (em producao, usar Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutos

function getClientIP(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  )
}

function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record) {
    return { allowed: true }
  }

  // Reset se passou o tempo de lockout
  if (now - record.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - record.lastAttempt)) / 1000 / 60)
    return { allowed: false, remainingTime }
  }

  return { allowed: true }
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (record) {
    record.count++
    record.lastAttempt = now
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
  }
}

function clearFailedAttempts(ip: string) {
  loginAttempts.delete(ip)
}

export async function loginAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const headersList = await headers()
  const cookieStore = await cookies()
  const ip = getClientIP(headersList)

  // Rate limiting check
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    return {
      error: `Muitas tentativas de login. Tente novamente em ${rateLimit.remainingTime} minutos.`,
      success: false,
    }
  }

  try {
    const payload = loginSchema.parse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    })

    const response = await loginWithCredentials(payload)
    await setAuthCookies(response.tokens)

    // Clear rate limit on success
    clearFailedAttempts(ip)

    // Verificar se usuario completou onboarding
    const hasSubscription = cookieStore.get("subscription_active")?.value === "true"
    
    return { error: null, success: true }
  } catch (err: any) {
    // Record failed attempt
    recordFailedAttempt(ip)

    const message = err?.message || "Credenciais invalidas. Verifique seu email e senha."
    return { error: message, success: false }
  }
}

export async function registerAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  await cookies()

  try {
    const payload = registerSchema.parse({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    })

    const response = await registerWithCredentials(payload)
    await setAuthCookies(response.tokens)

    return { error: null, success: true }
  } catch (err: any) {
    // Tratar erros de validacao do Zod
    if (err?.errors) {
      const firstError = err.errors[0]
      return { error: firstError?.message || "Dados invalidos", success: false }
    }

    const message = err?.message || "Erro ao criar conta. Tente novamente."
    return { error: message, success: false }
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const cookieStore = await cookies()

  try {
    // Pegar token do cookie (nao do formData por seguranca)
    const accessToken = cookieStore.get("access_token")?.value

    if (accessToken) {
      try {
        await serviceLogout(accessToken)
      } catch {
        // Ignora erros do servico - importante e limpar cookies locais
      }
    }

    await clearAuthCookies()

    // Limpar outros cookies relacionados
    cookieStore.set("subscription_active", "", { maxAge: 0, path: "/" })
    cookieStore.set("onboarding_tour_completed", "", { maxAge: 0, path: "/" })

    return { error: null, success: true }
  } catch (err: any) {
    // Mesmo com erro, tenta limpar cookies
    try {
      await clearAuthCookies()
    } catch {}

    return { error: null, success: true }
  }
}

// Versoes simplificadas para uso com forms nativos
export const logoutActionForm = async (): Promise<void> => {
  await logoutAction()
  redirect(routes.login)
}
