import type { ReactNode } from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type MetricCardProps = {
  label: string
  value: string
  helper?: string
  trend?: {
    value: number
    label?: string
  }
  icon?: ReactNode
  className?: string
}

export function MetricCard({
  label,
  value,
  helper,
  trend,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = trend && trend.value >= 0
  const isNegative = trend && trend.value < 0

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {(helper || trend) && (
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    isPositive && "text-success",
                    isNegative && "text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
              )}
              {helper && (
                <span className="text-muted-foreground text-xs">{helper}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-5">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-9 w-32 rounded bg-muted" />
        <div className="h-3 w-20 rounded bg-muted" />
      </div>
    </div>
  )
}
