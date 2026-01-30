import type { ReactNode } from "react"
import { InboxIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-12 text-center",
        className
      )}
    >
      <div className="bg-muted/50 text-muted-foreground mb-4 rounded-full p-3">
        {icon ?? <InboxIcon className="size-6" />}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
