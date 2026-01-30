import type { Locale } from "@/config/site"

export function formatCurrency(
  value: number,
  locale: Locale,
  currency: string
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(
  value: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    ...options,
  }).format(date)
}
