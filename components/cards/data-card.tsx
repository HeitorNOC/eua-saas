import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type DataCardProps = {
  children: ReactNode
  className?: string
}

export function DataCard({ children, className }: DataCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card divide-y divide-border",
        className
      )}
    >
      {children}
    </div>
  )
}

export type DataCardRowProps = {
  label: string
  value: ReactNode
  className?: string
}

export function DataCardRow({ label, value, className }: DataCardRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 px-4 py-3 sm:grid-cols-3",
        className
      )}
    >
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-sm font-medium sm:col-span-2">{value ?? "-"}</dd>
    </div>
  )
}

export type DataCardGridProps = {
  items: Array<{ label: string; value: ReactNode }>
  columns?: 2 | 3 | 4
  className?: string
}

export function DataCardGrid({
  items,
  columns = 2,
  className,
}: DataCardGridProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        columns === 2 && "grid gap-4 sm:grid-cols-2",
        columns === 3 && "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-muted-foreground text-xs font-medium">
            {item.label}
          </dt>
          <dd className="text-sm font-medium">{item.value ?? "-"}</dd>
        </div>
      ))}
    </div>
  )
}
