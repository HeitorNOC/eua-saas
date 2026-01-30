export type Role =
  | "owner"
  | "admin"
  | "manager"
  | "dispatcher"
  | "worker"
  | "finance"
  | "viewer"

export type Session = {
  userId: string
  accountId: string
  roles: Role[]
  permissions: string[]
  accessToken: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

export type AuthResponse = {
  user: AuthUser
  tokens: AuthTokens
}
