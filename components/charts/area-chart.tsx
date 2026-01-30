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
  data: Array<{ label: string; value: number }>
  className?: string
  height?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  formatValue?: (value: number) => string
}

export function AreaChart({
  data,
  className,
  height = 200,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  formatValue,
}: AreaChartProps) {
  if (!data.length) return null

  const formatter = formatValue ?? ((v: number) => v.toLocaleString("pt-BR"))

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#171717" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#171717" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              vertical={false}
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey="label"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          {showYAxis && (
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatter}
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
                    {formatter(item.value as number)}
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#171717"
            strokeWidth={2}
            fill="url(#areaGradient)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
