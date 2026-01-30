"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

export type BarChartProps = {
  data: Array<{ label: string; value: number; [key: string]: unknown }>
  className?: string
  height?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  color?: string
  radius?: number
}

export function BarChart({
  data,
  className,
  height = 200,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  color = "#171717",
  radius = 4,
}: BarChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
          <Bar
            dataKey="value"
            fill={color}
            radius={[radius, radius, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
