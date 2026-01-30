import { cookies } from "next/headers"

import { ApiError } from "@/lib/api/error"
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies"

type GraphQLError = {
  message: string
  extensions?: {
    code?: string
    statusCode?: number
  }
}

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

type GraphQLRequestOptions = {
  accessToken?: string
  headers?: HeadersInit
}

type RefreshTokenResponse = {
  refreshToken: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

function resolveGraphQLEndpoint() {
  const baseUrl = process.env.GRAPHQL_URL ?? process.env.API_BASE_URL ?? "http://localhost:4000"
  if (!baseUrl) {
    return "/graphql"
  }

  return baseUrl.endsWith("/graphql") ? baseUrl : `${baseUrl}/graphql`
}

function isUnauthenticated(responseStatus: number, payload?: GraphQLResponse<unknown> | null) {
  if (responseStatus === 401) {
    return true
  }

  return Boolean(
    payload?.errors?.some((error) => error.extensions?.code === "UNAUTHENTICATED")
  )
}

async function refreshAccessToken(refreshToken: string) {
  const mutation = `
    mutation RefreshToken($input: RefreshTokenInput!) {
      refreshToken(input: $input) {
        accessToken
        refreshToken
        expiresIn
      }
    }
  `

  const response = await fetch(resolveGraphQLEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input: { refreshToken } },
    }),
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    | GraphQLResponse<RefreshTokenResponse>
    | null

  if (!response.ok || payload?.errors?.length || !payload?.data?.refreshToken) {
    return null
  }

  return payload.data.refreshToken
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: GraphQLRequestOptions
) {
  const cookieStore = await cookies()
  const initialToken = options?.accessToken ?? cookieStore.get("access_token")?.value
  const refreshToken = cookieStore.get("refresh_token")?.value

  const execute = async (token?: string) => {
    const response = await fetch(resolveGraphQLEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers ?? {}),
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    })

    const payload = (await response.json().catch(() => null)) as
      | GraphQLResponse<T>
      | null

    return { response, payload }
  }

  let { response, payload } = await execute(initialToken)
  let refreshed = false

  if (refreshToken && isUnauthenticated(response.status, payload)) {
    const newTokens = await refreshAccessToken(refreshToken)
    if (newTokens) {
      await setAuthCookies(newTokens)
      refreshed = true
      const retryResult = await execute(newTokens.accessToken)
      response = retryResult.response
      payload = retryResult.payload
    }
  }

  if (!response.ok || payload?.errors?.length) {
    const message = payload?.errors?.map((error) => error.message).join("; ")
    if (!refreshed && isUnauthenticated(response.status, payload)) {
      await clearAuthCookies()
    }
    throw new ApiError(message || "GraphQL request failed", response.status, payload)
  }

  if (!payload?.data) {
    throw new ApiError("GraphQL response missing data", response.status, payload)
  }

  return payload.data
}
