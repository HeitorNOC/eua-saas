import type { Locale } from "@/config/site"
import type { ThemeTokens } from "@/lib/theme"

export type AccountPreferences = {
  locale: Locale
  currency: "BRL" | "USD" | "EUR"
  dateFormat: "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd"
  weekStartsOn: 0 | 1 | 6
  units: "metric" | "imperial"
  theme: ThemeTokens
}

export const defaultPreferences: AccountPreferences = {
  locale: "pt-BR",
  currency: "BRL",
  dateFormat: "dd/MM/yyyy",
  weekStartsOn: 1,
  units: "metric",
  theme: {
    primary: "oklch(0.488 0.243 264.376)",
    secondary: "oklch(0.967 0.001 286.375)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    mode: "light",
  },
}
