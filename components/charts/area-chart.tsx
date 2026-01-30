"use client"

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

export type AreaChartProps = {
  data: Array<{ label: string; value: number; [key: string]: unknown }>
  className?: string
  height?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  color?: string
  gradientFrom?: string
  gradientTo?: string
}

export function AreaChart({
  data,
  className,
  height = 200,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  color = "#171717",
  gradientFrom = "rgba(23, 23, 23, 0.3)",
  gradientTo = "rgba(23, 23, 23, 0)",
}: AreaChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border"
              vertical={false}
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey="label"
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          {showYAxis && (
            <YAxis
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
          )}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0]
              return (
                <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                  <p className="text-xs text-muted-foreground">
                    {item.payload.label}
                  </p>
                  <p className="text-sm font-semibold">
                    {typeof item.value === "number"
                      ? item.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : item.value}
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#areaGradient)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
