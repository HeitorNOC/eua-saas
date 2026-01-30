import type { Role, Session } from "@/lib/auth/types"

export function hasRole(session: Session, role: Role) {
  return session.roles.includes(role)
}

export function hasAnyRole(session: Session, roles: Role[]) {
  return roles.some((role) => session.roles.includes(role))
}

export function hasPermission(session: Session, permission: string) {
  return session.permissions.includes(permission)
}

export function hasAnyPermission(session: Session, permissions: string[]) {
  return permissions.some((permission) => session.permissions.includes(permission))
}

export function hasAllPermissions(session: Session, permissions: string[]) {
  return permissions.every((permission) => session.permissions.includes(permission))
}
