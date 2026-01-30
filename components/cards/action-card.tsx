import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type ActionCardProps = {
  title: string
  description?: string
  href: string
  icon?: ReactNode
  className?: string
}

export function ActionCard({
  title,
  description,
  href,
  icon,
  className,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:border-foreground/20 hover:bg-accent/50",
        className
      )}
    >
      {icon && (
        <div className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg group-hover:bg-foreground group-hover:text-background transition-colors">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          <ArrowRightIcon className="size-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
        </div>
        {description && (
          <p className="text-muted-foreground text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
