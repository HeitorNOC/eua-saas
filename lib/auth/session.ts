import { cookies } from "next/headers"
import { cache } from "react"

import { verifyAccessToken } from "@/lib/auth/service"
import type { Session, Role } from "@/lib/auth/types"

// Cache de request-level - evita multiplas verificacoes na mesma requisicao
export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value
  console.log("getSession accessToken:", accessToken)
  console.log("getSession cookieStore:", cookieStore)
  if (!accessToken) {
    return null
  }
  
  return verifyAccessToken(accessToken)
})

// Helpers para verificacao de permissoes
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function hasRole(role: Role): Promise<boolean> {
  const session = await getSession()
  return session?.roles.includes(role) ?? false
}

export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return roles.some(role => session.roles.includes(role))
}

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getSession()
  return session?.permissions.includes(permission) ?? false
}

export async function hasAllPermissions(permissions: string[]): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return permissions.every(p => session.permissions.includes(p))
}

// Verificar se usuario e admin ou owner
export async function isAdmin(): Promise<boolean> {
  return hasAnyRole(["admin", "owner"])
}
