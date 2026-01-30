import { cookies } from "next/headers"

import type { AuthTokens } from "@/lib/auth/types"

const accessTokenKey = "access_token"
const refreshTokenKey = "refresh_token"

export async function setAuthCookies(tokens: AuthTokens) {
  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === "production"

  cookieStore.set(accessTokenKey, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: tokens.expiresIn,
  })
  cookieStore.set(refreshTokenKey, tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: tokens.expiresIn * 7,
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  cookieStore.set(accessTokenKey, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  cookieStore.set(refreshTokenKey, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
