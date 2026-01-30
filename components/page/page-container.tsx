import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PageContainerProps = {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl space-y-8", className)}>
      {children}
    </div>
  )
}

export type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  backHref?: string
  backLabel?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Voltar",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {backHref && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground -ml-2 h-8 gap-1.5 px-2 hover:text-foreground"
        >
          <Link href={backHref}>
            <ArrowLeftIcon className="size-4" />
            {backLabel}
          </Link>
        </Button>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-sm text-pretty">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export type PageSectionProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            {title && (
              <h2 className="text-base font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export function PageGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}
