import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { siteConfig, type Locale } from "@/config/site"
import { routes } from "@/lib/routes"

const localeCookie = "locale"
const localeSet = new Set(siteConfig.locales)

function isLocale(value: string): value is Locale {
  return localeSet.has(value as Locale)
}

function resolveLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get(localeCookie)?.value
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.trim()
    if (preferred && isLocale(preferred)) {
      return preferred
    }
  }

  return siteConfig.defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const localeInPath = siteConfig.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  )

  if (localeInPath) {
    const cleanPath = pathname.replace(`/${localeInPath}`, "") || "/"
    const response = NextResponse.redirect(new URL(cleanPath, request.url))
    response.cookies.set(localeCookie, localeInPath, {
      path: "/",
      sameSite: "lax",
    })
    return response
  }

  const isMissingLocale = siteConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  )

  if (isMissingLocale) {
    const locale = resolveLocale(request)
    const response = NextResponse.next()
    response.cookies.set(localeCookie, locale, {
      path: "/",
      sameSite: "lax",
    })
    return response
  }

  const isAuthRoute = pathname.startsWith(routes.login) || pathname.startsWith(routes.register)
  const accessToken = request.cookies.get("access_token")?.value

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url))
  }

  if (!isAuthRoute && !accessToken) {
    return NextResponse.redirect(new URL(routes.login, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
