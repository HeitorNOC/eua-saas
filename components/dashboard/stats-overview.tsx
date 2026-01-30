"use client"

import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  BriefcaseIcon,
  UsersIcon,
  DollarSignIcon,
  CalendarCheckIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type StatItem = {
  label: string
  value: string | number
  change?: number // percentual de mudanca
  changeLabel?: string
  icon?: "jobs" | "clients" | "revenue" | "schedule"
}

const iconMap = {
  jobs: BriefcaseIcon,
  clients: UsersIcon,
  revenue: DollarSignIcon,
  schedule: CalendarCheckIcon,
}

export function StatsOverview({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon ? iconMap[stat.icon] : null
        const isPositive = stat.change && stat.change > 0
        const isNegative = stat.change && stat.change < 0
        const TrendIcon = isPositive
          ? TrendingUpIcon
          : isNegative
          ? TrendingDownIcon
          : MinusIcon

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
              {Icon && (
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
            {stat.change !== undefined && (
              <div className="mt-3 flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                    isPositive && "bg-green-100 text-green-700",
                    isNegative && "bg-red-100 text-red-700",
                    !isPositive && !isNegative && "bg-muted text-muted-foreground"
                  )}
                >
                  <TrendIcon className="size-3" />
                  <span>{Math.abs(stat.change)}%</span>
                </div>
                {stat.changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {stat.changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
