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
const publicRoutes = new Set(["/login", "/register", "/"])

// Rotas de onboarding (precisam de auth mas nao de subscription)
const onboardingRoutes = ["/onboarding", "/onboarding/business-type", "/onboarding/subscription", "/onboarding/setup"]

// Rotas de API que devem ser ignoradas pelo proxy
const apiRoutes = ["/api"]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.has(pathname)
}

function isOnboardingRoute(pathname: string): boolean {
  return onboardingRoutes.some(route => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return pathname === routes.login || pathname === routes.register
}

function isApiRoute(pathname: string): boolean {
  return apiRoutes.some(route => pathname.startsWith(route))
}

// Valida se o token tem formato JWT basico (nao substitui validacao no backend)
function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false
  
  // JWT tem 3 partes separadas por ponto
  const parts = token.split(".")
  if (parts.length !== 3) return false
  
  // Cada parte deve ser base64url valido
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/
  return parts.every(part => part.length > 0 && base64UrlRegex.test(part))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar rotas de API
  if (isApiRoute(pathname)) {
    return NextResponse.next()
  }

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
  const refreshToken = request.cookies.get("refresh_token")?.value
  const subscriptionActive = request.cookies.get("subscription_active")?.value === "true"
  
  // Validar formato do token (validacao real acontece no backend)
  const hasValidToken = accessToken && isValidTokenFormat(accessToken)
  const isAuthenticated = hasValidToken

  // Se tem token invalido, limpar e redirecionar para login
  if (accessToken && !hasValidToken && !isPublicRoute(pathname)) {
    const response = NextResponse.redirect(new URL(routes.login, request.url))
    response.cookies.delete("access_token")
    response.cookies.delete("refresh_token")
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Authenticated user trying to access auth routes -> redirect based on subscription
  if (isAuthenticated && isAuthRoute(pathname)) {
    const redirectUrl = subscriptionActive ? routes.dashboard : routes.onboarding
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Authenticated user without subscription trying to access app routes -> redirect to onboarding
  if (isAuthenticated && !subscriptionActive && !isPublicRoute(pathname) && !isOnboardingRoute(pathname)) {
    const response = NextResponse.redirect(new URL(routes.onboarding, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Authenticated user with subscription trying to access onboarding -> redirect to dashboard
  if (isAuthenticated && subscriptionActive && isOnboardingRoute(pathname)) {
    const response = NextResponse.redirect(new URL(routes.dashboard, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Unauthenticated user trying to access protected routes -> redirect to login
  if (!isAuthenticated && !isPublicRoute(pathname) && !isOnboardingRoute(pathname)) {
    const loginUrl = new URL(routes.login, request.url)
    // Salvar URL de callback para redirect apos login
    if (pathname !== routes.login) {
      loginUrl.searchParams.set("callbackUrl", pathname)
    }
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Unauthenticated user trying to access onboarding -> redirect to login
  if (!isAuthenticated && isOnboardingRoute(pathname)) {
    const loginUrl = new URL(routes.login, request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    return response
  }

  // Allow request to proceed
  const response = NextResponse.next()
  response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })

  // Adicionar headers de seguranca
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
