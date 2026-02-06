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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protecao contra loops de redirect: contador simples em cookie
  const redirectCount = Number(request.cookies.get("__redirect_count")?.value ?? 0)
  const MAX_REDIRECTS = 6

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
    if (cleanPath === pathname) {
      return NextResponse.next()
    }
    const response = NextResponse.redirect(new URL(cleanPath, request.url))
    response.cookies.set(localeCookie, localeInPath, {
      path: "/",
      sameSite: "lax",
    })
    // increment redirect counter
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "locale-in-path")
    return response
  }

  // 2. Resolve locale; so we'll set cookie only if changed/missing
  const locale = resolveLocale(request)
  const currentLocaleCookie = request.cookies.get(localeCookie)?.value

  // 3. Check authentication
  const accessToken = request.cookies.get("access_token")?.value
  const refreshToken = request.cookies.get("refresh_token")?.value
  const subscriptionActive = request.cookies.get("subscription_active")?.value === "true"

  // Real token validation using backend verification to keep middleware and app consistent
  // Validacao leve: formato + expiração
  const isAuthenticated = !!accessToken && isValidTokenFormat(accessToken) && !isJwtExpired(accessToken)

  // Decodifica payload para checar expiração (sem verificar assinatura)
  function isJwtExpired(token: string): boolean {
    try {
      const payloadB64 = token.split(".")[1]
      const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/")
      const withPadding = padded.padEnd(Math.ceil(padded.length / 4) * 4, "=")
      let json = ""
      if (typeof atob === "function") {
        json = atob(withPadding)
      } else {
        // Node fallback
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        json = Buffer.from(withPadding, "base64").toString("utf-8")
      }
      const payload = JSON.parse(json)
      const expSec = Number(payload?.exp)
      if (!expSec) return false
      const nowSec = Math.floor(Date.now() / 1000)
      return nowSec >= expSec
    } catch {
      return false
    }
  }

  // Se tem token invalido (presente no cookie mas nao autenticado), limpar e redirecionar para login
  if (accessToken && !isAuthenticated && !isPublicRoute(pathname)) {
    if (pathname === routes.login) {
      return NextResponse.next()
    }
    const response = NextResponse.redirect(new URL(routes.login, request.url))
    response.cookies.delete("access_token")
    response.cookies.delete("refresh_token")
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "invalid-token")
    return response
  }

  // Authenticated user trying to access auth routes -> redirect based on subscription
  if (isAuthenticated && isAuthRoute(pathname)) {
    // Prioriza callbackUrl quando presente
    const currentUrl = new URL(request.url)
    const callbackUrl = currentUrl.searchParams.get("callbackUrl")
    const safeCallback = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : null
    const redirectUrl = safeCallback ?? (subscriptionActive ? routes.dashboard : routes.onboarding)
    if (pathname === redirectUrl) {
      return NextResponse.next()
    }
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "auth-route")
    return response
  }

  // Authenticated user without subscription: allow dashboard/app routes to render.
  // Onboarding is presented inside dashboard via checklist; no forced redirect here.
  if (isAuthenticated && !subscriptionActive && isOnboardingRoute(pathname)) {
    // If the user navigates explicitly to onboarding while inactive, allow it.
    return NextResponse.next()
  }

  // Authenticated user with subscription trying to access onboarding -> redirect to dashboard
  if (isAuthenticated && subscriptionActive && isOnboardingRoute(pathname)) {
    if (pathname === routes.dashboard) {
      return NextResponse.next()
    }
    const response = NextResponse.redirect(new URL(routes.dashboard, request.url))
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "has-subscription-go-dashboard")
    return response
  }

  // Unauthenticated user trying to access protected routes -> redirect to login
  if (!isAuthenticated && !isPublicRoute(pathname) && !isOnboardingRoute(pathname)) {
    if (pathname === routes.login) {
      return NextResponse.next()
    }
    const loginUrl = new URL(routes.login, request.url)
    // Salvar URL de callback para redirect apos login
    if (pathname !== routes.login) {
      loginUrl.searchParams.set("callbackUrl", pathname)
    }
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "unauthenticated")
    return response
  }

  // Unauthenticated user trying to access onboarding -> redirect to login
  if (!isAuthenticated && isOnboardingRoute(pathname)) {
    if (pathname === routes.login) {
      return NextResponse.next()
    }
    const loginUrl = new URL(routes.login, request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
    response.cookies.set("__redirect_count", String(redirectCount + 1), { path: "/" })
    response.headers.set("X-Redirect-Reason", "unauthenticated-onboarding")
    return response
  }

  // Allow request to proceed
  // Se o contador de redirect estourou, nao aplicamos novos redirects passivos
  if (redirectCount >= MAX_REDIRECTS) {
    const pass = NextResponse.next()
    // Clear only if cookie exists to avoid Set-Cookie churn
    if (request.cookies.get("__redirect_count")?.value) {
      pass.cookies.set("__redirect_count", "", { path: "/", maxAge: 0 })
    }
    pass.headers.set("X-Proxy-Redirect-Guard", "true")
    return pass
  }

  const response = NextResponse.next()
  // Set locale cookie only when changed/missing to avoid churn that can trigger rerenders
  if (!currentLocaleCookie || currentLocaleCookie !== locale) {
    response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax" })
  }
  // reset contador quando passagem normal ocorre
  if (request.cookies.get("__redirect_count")?.value) {
    response.cookies.set("__redirect_count", "", { path: "/", maxAge: 0 })
  }

  // Adicionar headers de seguranca
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
