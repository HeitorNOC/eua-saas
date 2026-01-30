"use client"

import { cn } from "@/lib/utils"

export type AreaChartProps = {
  data: Array<{ label: string; value: number }>
  className?: string
  height?: number
}

export function AreaChart({ data, className, height = 200 }: AreaChartProps) {
  if (!data.length) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  // Gera pontos para o path SVG
  const width = 100
  const chartHeight = 100
  const padding = 10

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * (width - padding * 2) + padding
    const y =
      chartHeight -
      padding -
      ((item.value - minValue) / range) * (chartHeight - padding * 2)
    return { x, y, ...item }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" className="text-foreground" />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />
        {/* Points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={2.5}
            fill="currentColor"
            className="text-foreground"
          />
        ))}
      </svg>
      {/* Labels */}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {data.map((item, i) => (
          <span key={i}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}
