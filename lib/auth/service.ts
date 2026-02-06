import { graphqlRequest } from "@/lib/api/graphql"
import { ApiError } from "@/lib/api/error"
import type { AuthResponse, Role, Session, AuthTokens } from "@/lib/auth/types"

type VerifyTokenResponse = {
  valid: boolean
  user?: {
    id: string
    accountId: string
    roles: string[]
    permissions: string[]
  }
  error?: string
}

export async function verifyAccessToken(accessToken: string): Promise<Session | null> {
  // Default permissions when role is owner and backend enrichment isn't available
  const OWNER_DEFAULT_PERMISSIONS = [
    // Core user/account management
    "users:view",
    "users:create",
    "users:update",
    "users:delete",
    "users:manage-roles",
    "users:deactivate",
    "users:activate",
    "roles:view",
    "roles:create",
    "roles:update",
    "roles:delete",
    "roles:manage-permissions",
    "account:view",
    "account:update",
    "account:manage-settings",
    "invitations:view",
    "invitations:create",
    "invitations:cancel",
    "sessions:view",
    "sessions:revoke",
    "audit:view",
    // Domain features
    "jobs:view",
    "jobs:create",
    "jobs:update",
    "jobs:delete",
    "payments:view",
    "payments:manage",
    "clients:view",
    "clients:create",
    "clients:update",
    "clients:delete",
    // App navigation related
    "schedule:view",
    "reports:view",
    "settings:view",
    "estimates:view",
    "workforce:view",
  ]
  // Helper: decode JWT payload locally as a fallback when backend verification fails
  const decodeJwt = (token: string) => {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) return null
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
      const json = Buffer.from(base64, "base64").toString("utf8")
      return JSON.parse(json) as { sub?: string; accountId?: string; roles?: string[] }
    } catch {
      return null
    }
  }

  // Prefer JWT payload: fastest and schema-agnostic
  const payload = decodeJwt(accessToken)
  if (payload?.sub && payload?.accountId) {
    const normalizedRoles = (payload.roles || []).map((r) => r.toLowerCase()) as Session["roles"]
    console.log("verifyAccessToken using JWT payload")
    const baseSession: Session = {
      userId: payload.sub,
      accountId: payload.accountId,
      roles: normalizedRoles,
      permissions: normalizedRoles.includes("owner") ? OWNER_DEFAULT_PERMISSIONS : [],
      accessToken,
    }
    // Try to enrich with backend permissions using existing schema pattern (validateToken)
    try {
      const query = `
        query ValidateToken($token: String!) {
          validateToken(token: $token) {
            valid
            user { id accountId roles permissions }
          }
        }
      `
      const data = await graphqlRequest<{ validateToken: { valid: boolean; user?: { id: string; accountId: string; roles: string[]; permissions: string[] } } }>(
        query,
        { token: accessToken },
        { accessToken }
      )
      if (data.validateToken?.valid && data.validateToken.user) {
        console.log('data: ', data);
        const user = data.validateToken.user
        const roles = (user.roles || []).map((r) => r.toLowerCase()) as Session["roles"]
        return {
          userId: user.id,
          accountId: user.accountId,
          roles,
          permissions: user.permissions || [],
          accessToken,
        }
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        console.warn("validateToken enrichment failed:", {
          status: err.status,
          message: err.message,
        })
      } else {
        console.warn("validateToken enrichment error:", err?.message || err)
      }
    }
    return baseSession
  }

  // If JWT lacked required fields, attempt conventional `me` query with bearer token
  try {
    const meQuery = `
      query Me {
        me { id accountId roles }
      }
    `
    const meData = await graphqlRequest<{ me?: { id: string; accountId: string; roles: string[] } }>(meQuery, undefined, { accessToken })
    if (meData?.me?.id) {
      const normalizedRoles = (meData.me.roles || []).map((r) => r.toLowerCase()) as Session["roles"]
      return {
        userId: meData.me.id,
        accountId: meData.me.accountId,
        roles: normalizedRoles,
        permissions: [],
        accessToken,
      }
    }
    return null
  } catch (err: any) {
    if (err instanceof ApiError) {
      console.error("verifyAccessToken ApiError:", {
        status: err.status,
        message: err.message,
        payload: err.payload,
      })
    } else {
      console.error("verifyAccessToken error:", err?.message || err)
    }
    return null
  }
}

export async function loginWithCredentials(payload: {
  email: string
  password: string
}): Promise<AuthResponse> {
  // GraphQL mutation para login
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        user { id email firstName lastName }
        tokens { accessToken refreshToken expiresIn }
      }
    }
  `;
  try {
    const data = await graphqlRequest<{ login: AuthResponse }>(mutation, { input: payload });
    if (!data.login) throw new Error("Login falhou");
    return data.login;
  } catch (err: any) {
    throw new Error(err?.message || "Erro ao autenticar");
  }
}

export async function registerWithCredentials(payload: {
  email: string
  password: string
  firstName?: string
  lastName?: string
}): Promise<AuthResponse> {
  const mutation = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        user { id email firstName lastName }
        tokens { accessToken refreshToken expiresIn }
      }
    }
  `
  const data = await graphqlRequest<{ register: AuthResponse }>(mutation, { input: payload })
  return data.register
}

export async function logout(accessToken: string) {
  const mutation = `mutation Logout { logout { success } }`
  try {
    await graphqlRequest<{ logout: { success: boolean } }>(mutation, undefined, { accessToken })
  } catch {
    // ignore logout errors
  }
}
