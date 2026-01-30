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
  data: Array<{ label: string; value: number }>
  className?: string
  height?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  formatValue?: (value: number) => string
}

export function BarChart({
  data,
  className,
  height = 200,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  formatValue,
}: BarChartProps) {
  if (!data.length) return null

  const formatter = formatValue ?? ((v: number) => v.toLocaleString("pt-BR"))

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
          <Bar
            dataKey="value"
            fill="#171717"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
