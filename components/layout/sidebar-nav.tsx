"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavItem } from "@/config/navigation"
import {
  BarChart3Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  UsersIcon,
  WalletCardsIcon,
  WrenchIcon,
} from "lucide-react"
const iconMap = {
  LayoutDashboardIcon,
  ClipboardListIcon,
  CalendarDaysIcon,
  UsersIcon,
  WrenchIcon,
  WalletCardsIcon,
  BarChart3Icon,
}
import { useI18n } from "@/components/providers/i18n-provider"
import { cn } from "@/lib/utils"

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const { t } = useI18n()
  console.log('[SIDEBAR] items recebidos:', items)
  if (items.length > 0 && items[0].roles) {
    console.log('[SIDEBAR] roles permitidos do primeiro item:', items)
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = iconMap[item.icon as keyof typeof iconMap]
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
              isActive && "bg-muted text-foreground"
            )}
          >
            {Icon && <Icon className="size-4" />}
            {t(item.titleKey)}
          </Link>
        )
      })}
    </nav>
  )
}
