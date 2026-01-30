"use server"

import { cookies } from "next/headers"

import { loginSchema, registerSchema } from "@/features/auth/schemas"
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies"
import { loginWithCredentials, registerWithCredentials, logout as serviceLogout } from "@/lib/auth/service"

export type ActionResult = { error: string | null; success: boolean }

export async function loginAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  await cookies()
  
  try {
    const payload = loginSchema.parse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    })
    const response = await loginWithCredentials(payload)
    await setAuthCookies(response.tokens)
    return { error: null, success: true }
  } catch (err: any) {
    const message = err?.message || "Erro ao autenticar. Verifique suas credenciais."
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
    const message = err?.message || "Erro ao criar conta."
    return { error: message, success: false }
  }
}

export const registerActionForm = async (formData: FormData): Promise<void> => {
  await registerAction(undefined, formData)
}

export async function logoutAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  await cookies()
  
  try {
    const accessToken = formData.get("accessToken")
    if (typeof accessToken === "string" && accessToken.length > 0) {
      try {
        await serviceLogout(accessToken)
      } catch {
        // ignore service errors
      }
    }
    await clearAuthCookies()
    return { error: null, success: true }
  } catch (err: any) {
    const message = err?.message || "Erro ao deslogar."
    return { error: message, success: false }
  }
}

export const logoutActionForm = async (formData: FormData): Promise<void> => {
  await logoutAction(undefined, formData)
}

