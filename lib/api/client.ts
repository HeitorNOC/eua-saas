import { ApiError, ApiResponse } from "./error"

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.API_BASE_URL ?? ""
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError("Request failed", response.status, payload)
  }

  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return payload as ApiResponse<T>
  }

  return { data: payload as T }
}

// NOTE: REST helper wrappers (`apiPost`, `apiPut`, `apiPatch`, `apiDelete`) removed.
// This project uses GraphQL via `graphqlRequest`. If you need REST helpers
// in the future, re-add small wrappers that delegate to `apiFetch`.
