import { z } from "zod"

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
])

export const paymentSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid().nullable(),
  amount: z.number().positive(),
  currency: z.string().min(3),
  status: paymentStatusSchema,
  method: z.string().min(2).nullable(),
  paidAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createPaymentSchema = z.object({
  jobId: z.string().uuid().nullable().optional(),
  amount: z.number().positive(),
  currency: z.string().min(3),
  method: z.string().min(2).nullable().optional(),
})

export const updatePaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  status: paymentStatusSchema.optional(),
  method: z.string().min(2).nullable().optional(),
  paidAt: z.string().datetime().nullable().optional(),
})

export type Payment = z.infer<typeof paymentSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>
