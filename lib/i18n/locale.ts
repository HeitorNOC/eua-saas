import { cookies } from "next/headers"

import { siteConfig, type Locale } from "@/config/site"

export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("locale")?.value

  if (cookieLocale && siteConfig.locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  return siteConfig.defaultLocale
}
