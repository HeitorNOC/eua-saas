"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-success/50 group-[.toaster]:bg-success/10 group-[.toaster]:text-success",
          error:
            "group-[.toaster]:border-destructive/50 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive",
          warning:
            "group-[.toaster]:border-warning/50 group-[.toaster]:bg-warning/10 group-[.toaster]:text-warning",
          info: "group-[.toaster]:border-info/50 group-[.toaster]:bg-info/10 group-[.toaster]:text-info",
        },
      }}
      {...props}
    />
  )
}

// Re-export toast for easy imports
export { toast } from "sonner"
