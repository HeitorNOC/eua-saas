import { cookies } from "next/headers"

import type { AuthTokens } from "@/lib/auth/types"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

// Configuracoes de cookie seguras
function getCookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === "production"
  
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge,
  }
}

export async function setAuthCookies(tokens: AuthTokens) {
  const cookieStore = await cookies()
  
  // Access token - expira conforme definido pelo backend
  cookieStore.set(
    ACCESS_TOKEN_KEY,
    tokens.accessToken,
    getCookieOptions(tokens.expiresIn)
  )
  
  // Refresh token - expira em 7 dias (mais longo que access token)
  cookieStore.set(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken,
    getCookieOptions(60 * 60 * 24 * 7) // 7 dias
  )
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  const clearOptions = getCookieOptions(0)

  cookieStore.set(ACCESS_TOKEN_KEY, "", clearOptions)
  cookieStore.set(REFRESH_TOKEN_KEY, "", clearOptions)
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value
}

// Verifica se usuario esta autenticado (tem token valido)
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken()
  return !!token && token.length > 0
}
