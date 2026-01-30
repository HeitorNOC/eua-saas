// Helper types and utilities for server actions

export type ActionState<T = unknown> = {
  success: boolean
  error: string | null
  data?: T
}

export function successState<T>(data?: T): ActionState<T> {
  return { success: true, error: null, data }
}

export function errorState(message: string): ActionState {
  return { success: false, error: message }
}

// Parse common form data patterns
export function parseFormData<T extends Record<string, unknown>>(
  formData: FormData,
  fields: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {}
  for (const field of fields) {
    const value = formData.get(String(field))
    if (value !== null) {
      result[field] = String(value) as T[keyof T]
    }
  }
  return result
}
