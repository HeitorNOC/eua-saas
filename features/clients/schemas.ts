import { z } from "zod"

export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  address: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const createClientSchema = clientSchema.omit({ id: true })
export const updateClientSchema = clientSchema.partial().extend({
  id: z.string().uuid(),
})

export type Client = z.infer<typeof clientSchema>
export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
