import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas publicas que nao precisam de autenticacao
const publicRoutes = ["/login", "/register"]

// Rotas que sao apenas para usuarios NAO autenticados
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value

  const isAuthenticated = !!accessToken
  const isPublicRoute = publicRoutes.some((route) => pathname === route)
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // Se usuario esta autenticado e tenta acessar rota de auth (login/register)
  // redireciona para dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Se usuario NAO esta autenticado e tenta acessar rota protegida
  // redireciona para login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    // Preserva a URL original para redirect apos login
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}
