import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { AppShell } from "@/components/layout/app-shell"
import { getSession } from "@/lib/auth/session"
import { routes } from "@/lib/routes"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const hasToken = !!cookieStore.get("access_token")?.value
  const session = await getSession()

  // Comportamento: proxy/middleware controla acesso; aqui apenas renderizamos quando ha token
  // Evita loops caso a verificacao remota falhe intermitentemente
  if (!hasToken) {
    // Sem token, nao ha como renderizar app; proxy deve redirecionar antes
    // Mantemos comportamento defensivo aqui: pagina vazia
    return null
  }

  const roles = session?.roles ?? []
  const permissions = session?.permissions ?? []
  console.log("AppLayout roles:", roles, "permissions:", permissions)
  console.log("AppLayout session:", session)
  return <AppShell roles={roles} permissions={permissions}>{children}</AppShell>
}
