"use client"

import { cn } from "@/lib/utils"

export type BarChartProps = {
  data: Array<{ label: string; value: number }>
  className?: string
  height?: number
}

export function BarChart({ data, className, height = 200 }: BarChartProps) {
  if (!data.length) return null

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className={cn("flex flex-col", className)} style={{ height }}>
      <div className="flex flex-1 items-end gap-2">
        {data.map((item, i) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center">
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md border bg-card px-2 py-1 text-xs shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-medium">{item.value}</span>
              </div>
              {/* Bar */}
              <div
                className="w-full max-w-12 rounded-t-md bg-foreground/80 transition-all group-hover:bg-foreground"
                style={{ height: `${percentage}%`, minHeight: item.value > 0 ? 4 : 0 }}
              />
            </div>
          )
        })}
      </div>
      {/* Labels */}
      <div className="mt-3 flex gap-2">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex-1 truncate text-center text-xs text-muted-foreground"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
