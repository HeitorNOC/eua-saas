"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

type ActionState = {
  success: boolean
  error: string | null
}

type ToastOptions = {
  successMessage?: string
  errorPrefix?: string
  showOnSuccess?: boolean
}

/**
 * Hook para mostrar toasts automaticamente baseado no resultado de server actions
 * 
 * @example
 * const [state, action] = useActionState(myAction, { success: false, error: null })
 * useActionToast(state, { successMessage: "Salvo com sucesso!" })
 */
export function useActionToast(
  state: ActionState | null,
  options: ToastOptions = {}
) {
  const {
    successMessage = "Operacao realizada com sucesso!",
    errorPrefix = "Erro",
    showOnSuccess = true,
  } = options

  const hasTriggered = useRef(false)
  const prevStateRef = useRef(state)

  useEffect(() => {
    // Skip if state hasn't changed or is initial
    if (!state || state === prevStateRef.current) return

    // Update previous state reference
    prevStateRef.current = state

    if (state.error) {
      toast.error(`${errorPrefix}`, {
        description: state.error,
      })
      hasTriggered.current = true
    } else if (state.success && showOnSuccess && !hasTriggered.current) {
      toast.success(successMessage)
      hasTriggered.current = true
    }
  }, [state, successMessage, errorPrefix, showOnSuccess])

  // Reset trigger when state resets
  useEffect(() => {
    if (state?.success === false && state?.error === null) {
      hasTriggered.current = false
    }
  }, [state])
}

// Shorthand functions for manual toast calls
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description })
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },
}
