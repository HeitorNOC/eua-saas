import type { CSSProperties } from "react"
import { cookies } from "next/headers"

export type ThemeMode = "light" | "dark"

export type ThemeTokens = {
  primary: string
  secondary: string
  background: string
  foreground: string
  mode: ThemeMode
}

export const defaultTheme: ThemeTokens = {
  primary: "oklch(0.488 0.243 264.376)",
  secondary: "oklch(0.967 0.001 286.375)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.141 0.005 285.823)",
  mode: "light",
}

type CookieStore = Awaited<ReturnType<typeof cookies>>

export function getThemeFromCookies(cookieStore: CookieStore) {
  const cookie = cookieStore.get("account-theme")?.value
  if (!cookie) {
    return defaultTheme
  }

  try {
    const parsed = JSON.parse(cookie) as Partial<ThemeTokens>
    return { ...defaultTheme, ...parsed }
  } catch {
    return defaultTheme
  }
}

export function themeToCssVariables(theme: ThemeTokens): CSSProperties {
  return {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--background": theme.background,
    "--foreground": theme.foreground,
  } as CSSProperties
}
