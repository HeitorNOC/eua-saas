"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function MiniAreaChart({
  data,
  className,
}: {
  data: ReadonlyArray<{ value: number }>
  className?: string
}) {
  const max = Math.max(...data.map((item) => item.value))

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (item.value / max) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox="0 0 100 100" className="h-32 w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          points={points}
          className="text-primary"
        />
        <polyline
          fill="currentColor"
          points={`0,100 ${points} 100,100`}
          className="text-primary/15"
        />
      </svg>
    </div>
  )
}
