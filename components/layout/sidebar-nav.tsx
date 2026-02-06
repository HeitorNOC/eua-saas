"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  WalletCardsIcon,
  WrenchIcon,
} from "lucide-react"

import type { NavItem } from "@/config/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { cn } from "@/lib/utils"

const iconMap = {
  LayoutDashboardIcon,
  ClipboardListIcon,
  FileTextIcon,
  CalendarDaysIcon,
  UsersIcon,
  WrenchIcon,
  WalletCardsIcon,
  BarChart3Icon,
  SettingsIcon,
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = iconMap[item.icon as keyof typeof iconMap]

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            )}
            <span className="truncate">{t(item.titleKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
