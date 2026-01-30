import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        default: "bg-muted text-muted-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        error: "bg-destructive/15 text-destructive",
        info: "bg-info/15 text-info",
        pending: "bg-warning/15 text-warning",
        active: "bg-success/15 text-success",
        completed: "bg-muted text-muted-foreground",
        scheduled: "bg-info/15 text-info",
        in_progress: "bg-success/15 text-success",
        cancelled: "bg-destructive/15 text-destructive",
        paid: "bg-success/15 text-success",
        failed: "bg-destructive/15 text-destructive",
      },
      dot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      status: "default",
      dot: true,
    },
  }
)

const dotColorMap: Record<string, string> = {
  default: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-info",
  pending: "bg-warning",
  active: "bg-success",
  completed: "bg-muted-foreground",
  scheduled: "bg-info",
  in_progress: "bg-success",
  cancelled: "bg-destructive",
  paid: "bg-success",
  failed: "bg-destructive",
}

export type StatusBadgeProps = {
  children: React.ReactNode
  className?: string
} & VariantProps<typeof statusBadgeVariants>

export function StatusBadge({
  status,
  dot = true,
  className,
  children,
}: StatusBadgeProps) {
  const dotColor = dotColorMap[status ?? "default"] ?? dotColorMap.default

  return (
    <span className={cn(statusBadgeVariants({ status, dot }), className)}>
      {dot && (
        <span
          className={cn("size-1.5 rounded-full", dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
