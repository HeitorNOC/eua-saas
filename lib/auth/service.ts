import { graphqlRequest } from "@/lib/api/graphql"
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
  try {
    const query = `
      query VerifyAccessToken($token: String!) {
        verifyAccessToken(token: $token) {
          valid
          user { id accountId roles permissions }
        }
      }
    `
    const data = await graphqlRequest<{ verifyAccessToken: { valid: boolean; user?: { id: string; accountId: string; roles: string[]; permissions: string[] } } }>(query, { token: accessToken }, { accessToken })
    if (!data.verifyAccessToken?.valid || !data.verifyAccessToken?.user) return null
    const user = data.verifyAccessToken.user
    return {
      userId: user.id,
      accountId: user.accountId,
      roles: user.roles as Session["roles"],
      permissions: user.permissions,
      accessToken,
    }
  } catch {
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
