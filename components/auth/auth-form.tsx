"use client"

import type { ReactNode } from "react"
import { useFormStatus } from "react-dom"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthFormProps = {
  children: ReactNode
  action: (formData: FormData) => void
  submitLabel: string
  error?: string | null
  className?: string
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          Aguarde...
        </>
      ) : (
        label
      )}
    </Button>
  )
}

export function AuthForm({
  children,
  action,
  submitLabel,
  error,
  className,
}: AuthFormProps) {
  return (
    <form action={action} className={cn("space-y-4", className)}>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {children}
      <SubmitButton label={submitLabel} />
    </form>
  )
}
