import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { getSession } from "@/lib/auth/session"
import { routes } from "@/lib/routes"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect(routes.login)
  }

  // Passa roles e permissions para o AppShell
  return <AppShell roles={session.roles} permissions={session.permissions}>{children}</AppShell>
}
