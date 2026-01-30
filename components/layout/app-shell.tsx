import type { ReactNode } from "react"
import Link from "next/link"
import { CommandIcon } from "lucide-react"

import { getNavItems } from "@/config/navigation"
import type { Role } from "@/lib/auth/types"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Topbar } from "@/components/layout/topbar"
import { LogoutForm } from "@/components/auth/logout-form"
import { routes } from "@/lib/routes"

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
        <aside className="bg-card/50 fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r backdrop-blur-sm lg:flex">
          <div className="flex h-14 items-center gap-2 border-b px-4">
            <Link
              href={routes.dashboard}
              className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
            >
              <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
                <CommandIcon className="size-4" />
              </div>
              <span className="text-sm">Field Services</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav items={navItems} />
          </div>
          <div className="border-t p-3">
            <LogoutForm />
          </div>
        </aside>
        <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
          <Topbar />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
