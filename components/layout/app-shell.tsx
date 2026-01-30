import type { ReactNode } from "react"

import { getNavItems } from "@/config/navigation"
import type { Role } from "@/lib/auth/types"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Topbar } from "@/components/layout/topbar"
import { LogoutForm } from "@/components/auth/logout-form"

export function AppShell({
  roles,
  permissions,
  children,
}: {
  roles?: Role[]
  permissions?: string[]
  children: ReactNode
}) {
  const navItems = getNavItems(roles, permissions)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex min-h-screen">
        <aside className="border-r bg-card hidden w-64 flex-col gap-6 px-4 py-6 lg:flex">
          <div className="text-lg font-semibold">USA SaaS</div>
          <SidebarNav items={navItems} />
          <div className="mt-auto border-t pt-4">
            <LogoutForm />
          </div>
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
