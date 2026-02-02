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

// Rotas publicas que nao precisam de autenticacao
const publicRoutes = ["/login", "/register", "/"]

// Rotas de onboarding (precisam de auth mas nao de subscription)
const onboardingRoutes = ["/onboarding", "/onboarding/business-type", "/onboarding/subscription", "/onboarding/setup"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle locale in path (redirect and set cookie)
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

  // 2. Set locale cookie if missing
  const locale = resolveLocale(request)
  
  // 3. Check authentication
  const accessToken = request.cookies.get("access_token")?.value
  const subscriptionActive = request.cookies.get("subscription_active")?.value === "true"
  const isAuthenticated = !!accessToken
  const isAuthRoute = pathname === routes.login || pathname === routes.register
  const isPublicRoute = publicRoutes.includes(pathname)
  const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route))

  // Authenticated user trying to access auth routes -> redirect based on subscription
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = subscriptionActive ? routes.dashboard : routes.onboarding
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Authenticated user without subscription trying to access app routes -> redirect to onboarding
  if (isAuthenticated && !subscriptionActive && !isPublicRoute && !isOnboardingRoute) {
    const response = NextResponse.redirect(new URL(routes.onboarding, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Authenticated user with subscription trying to access onboarding -> redirect to dashboard
  if (isAuthenticated && subscriptionActive && isOnboardingRoute) {
    const response = NextResponse.redirect(new URL(routes.dashboard, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Unauthenticated user trying to access protected routes -> redirect to login
  if (!isAuthenticated && !isPublicRoute && !isOnboardingRoute) {
    const loginUrl = new URL(routes.login, request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Allow request to proceed
  const response = NextResponse.next()
  response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
