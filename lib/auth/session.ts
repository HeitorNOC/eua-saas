import { cookies } from "next/headers"
import { cache } from "react"

import { verifyAccessToken } from "@/lib/auth/service"

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value
  if (!accessToken) {
    return null
  }
  return verifyAccessToken(accessToken)
})
