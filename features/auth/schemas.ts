import { z } from "zod"

// Password deve ter no minimo 8 caracteres, 1 maiuscula, 1 minuscula, 1 numero
const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no minimo 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiuscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minuscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um numero")

// Para login, validacao mais simples (servidor valida)
const loginPasswordSchema = z.string().min(1, "Senha e obrigatoria")

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: loginPasswordSchema,
})

export const registerSchema = z.object({
  email: z.string().email("Email invalido"),
  password: passwordSchema,
  firstName: z.string().min(2, "Nome deve ter no minimo 2 caracteres").optional(),
  lastName: z.string().min(2, "Sobrenome deve ter no minimo 2 caracteres").optional(),
})

// Schema para mudanca de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual e obrigatoria"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas nao conferem",
  path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
