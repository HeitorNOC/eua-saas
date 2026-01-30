import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import type { Role } from "@/lib/auth/types"
import { getSession } from "@/lib/auth/session"
import { hasAnyRole } from "@/lib/auth/authorization"
import { routes } from "@/lib/routes"

export async function RequireRole({
  roles,
  children,
}: {
  roles: Role[]
  children: ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect(routes.login)
  }

  if (!hasAnyRole(session, roles)) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
        Você não tem permissão para acessar este módulo.
      </div>
    )
  }

  return <>{children}</>
}
