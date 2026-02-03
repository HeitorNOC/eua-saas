"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { graphqlRequest } from "@/lib/api/graphql"
import { ActionState, successState, errorState } from "@/lib/actions/helpers"
import { routes } from "@/lib/routes"

// Schemas
const profileSchema = z.object({
  firstName: z.string().min(1, "Nome e obrigatorio"),
  lastName: z.string().min(1, "Sobrenome e obrigatorio"),
  email: z.string().email("Email invalido"),
})

const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["pt-BR", "en-US", "es-ES"]),
  notifications: z.enum(["all", "important", "none"]),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual e obrigatoria"),
  newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirme a nova senha"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Senhas nao conferem",
  path: ["confirmPassword"],
})

// Cookie keys
const THEME_KEY = "theme"
const LOCALE_KEY = "locale"
const NOTIFICATIONS_KEY = "notifications_preference"

// Update profile
export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = profileSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
    })
    
    // TODO: Call GraphQL mutation to update profile
    // const mutation = `
    //   mutation UpdateProfile($input: UpdateProfileInput!) {
    //     updateProfile(input: $input) {
    //       user { id firstName lastName email }
    //     }
    //   }
    // `
    // await graphqlRequest(mutation, { input: data })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    revalidatePath(routes.settings)
    
    return successState({ ...data, message: "Perfil atualizado com sucesso" })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorState(err.errors[0]?.message || "Dados invalidos")
    }
    return errorState(err?.message || "Erro ao atualizar perfil")
  }
}

// Update preferences (theme, language, notifications)
export async function updatePreferencesAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies()
  
  try {
    const data = preferencesSchema.parse({
      theme: formData.get("theme"),
      language: formData.get("language"),
      notifications: formData.get("notifications"),
    })
    
    // Save preferences to cookies
    cookieStore.set(THEME_KEY, data.theme, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    
    cookieStore.set(LOCALE_KEY, data.language, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    })
    
    cookieStore.set(NOTIFICATIONS_KEY, data.notifications, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    })
    
    // TODO: Also persist to backend
    // await graphqlRequest(mutation, { input: data })
    
    revalidatePath(routes.settings)
    
    return successState({ ...data, message: "Preferencias salvas com sucesso" })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorState(err.errors[0]?.message || "Dados invalidos")
    }
    return errorState(err?.message || "Erro ao salvar preferencias")
  }
}

// Change password
export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = passwordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    })
    
    // TODO: Call GraphQL mutation to change password
    // const mutation = `
    //   mutation ChangePassword($input: ChangePasswordInput!) {
    //     changePassword(input: $input) { success }
    //   }
    // `
    // await graphqlRequest(mutation, { 
    //   input: { 
    //     currentPassword: data.currentPassword, 
    //     newPassword: data.newPassword 
    //   } 
    // })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return successState({ message: "Senha alterada com sucesso" })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorState(err.errors[0]?.message || "Dados invalidos")
    }
    return errorState(err?.message || "Erro ao alterar senha")
  }
}

// Delete account
export async function deleteAccountAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const confirmText = formData.get("confirmText")
    
    if (confirmText !== "EXCLUIR") {
      return errorState("Digite EXCLUIR para confirmar")
    }
    
    // TODO: Call GraphQL mutation to delete account
    // const mutation = `
    //   mutation DeleteAccount {
    //     deleteAccount { success }
    //   }
    // `
    // await graphqlRequest(mutation)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Clear all cookies
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")
    cookieStore.delete("subscription_active")
    cookieStore.delete(THEME_KEY)
    cookieStore.delete(LOCALE_KEY)
    
    return successState({ message: "Conta excluida com sucesso", redirect: "/" })
  } catch (err: any) {
    return errorState(err?.message || "Erro ao excluir conta")
  }
}

// Get preferences from cookies
export async function getPreferencesFromCookies() {
  const cookieStore = await cookies()
  
  return {
    theme: (cookieStore.get(THEME_KEY)?.value || "system") as "light" | "dark" | "system",
    language: (cookieStore.get(LOCALE_KEY)?.value || "pt-BR") as "pt-BR" | "en-US" | "es-ES",
    notifications: (cookieStore.get(NOTIFICATIONS_KEY)?.value || "all") as "all" | "important" | "none",
  }
}
