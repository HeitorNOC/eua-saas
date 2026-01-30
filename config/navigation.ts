import * as React from "react"
import {
  BarChart3Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  UsersIcon,
  WalletCardsIcon,
  WrenchIcon,
} from "lucide-react"

import type { Locale } from "@/config/site"
import type { Role } from "@/lib/auth/types"

export type NavItem = {
  titleKey:
    | "nav.dashboard"
    | "nav.jobs"
    | "nav.schedule"
    | "nav.clients"
    | "nav.workforce"
    | "nav.payments"
    | "nav.reports"
  href: string
  icon: string // agora é string
  roles?: Role[]
  permissions?: string[] // permissões necessárias
}

const baseItems: Omit<NavItem, "href">[] = [
  { titleKey: "nav.dashboard", icon: "LayoutDashboardIcon" },
  {
    titleKey: "nav.jobs",
    icon: "ClipboardListIcon",
    roles: ["owner", "admin", "manager", "dispatcher"],
    permissions: ["jobs:view"],
  },
  {
    titleKey: "nav.schedule",
    icon: "CalendarDaysIcon",
    roles: ["owner", "admin", "manager", "dispatcher"],
    permissions: ["schedule:view"],
  },
  {
    titleKey: "nav.clients",
    icon: "UsersIcon",
    roles: ["owner", "admin", "manager", "dispatcher"],
    permissions: ["clients:view"],
  },
  {
    titleKey: "nav.workforce",
    icon: "WrenchIcon",
    roles: ["owner", "admin", "manager"],
    permissions: ["workforce:view"],
  },
  {
    titleKey: "nav.payments",
    icon: "WalletCardsIcon",
    roles: ["owner", "admin", "finance"],
    permissions: ["payments:view"],
  },
  {
    titleKey: "nav.reports",
    icon: "BarChart3Icon",
    roles: ["owner", "admin", "manager"],
    permissions: ["reports:view"],
  },
]

export function getNavItems(roles?: Role[], permissions?: string[]): NavItem[] {
  return baseItems
    .filter((item) => {
      // Se o item tem roles, filtra por roles
      const roleOk = item.roles ? roles?.some((role) => item.roles?.includes(role)) : true
      // Se o item tem permissões, filtra por permissões
      const permOk = item.permissions ? permissions?.some((p) => item.permissions?.includes(p)) : true
      return roleOk && permOk
    })
    .map((item) => ({
      ...item,
      href: `/${item.titleKey.replace("nav.", "")}`,
    }))
}
