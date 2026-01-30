"use client"

import type { InputHTMLAttributes } from "react"
import { forwardRef } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, className, id, ...props }, ref) {
    const fieldId = id ?? props.name

    return (
      <div className="space-y-2">
        <Label
          htmlFor={fieldId}
          className={cn(error && "text-destructive")}
        >
          {label}
        </Label>
        <Input
          ref={ref}
          id={fieldId}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
