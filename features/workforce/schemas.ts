import { z } from "zod"

export const workerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email().nullable(),
  phone: z.string().min(8).nullable(),
  userId: z.string().uuid().nullable(),
  workerType: z.string().min(2),
  hourlyRate: z.number().nonnegative().nullable(),
  dailyRate: z.number().nonnegative().nullable(),
  skills: z.array(z.string().min(2)),
  notes: z.string().min(2).nullable(),
  status: z.string().min(2),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  roles: z.array(
    z.object({
      role: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      }),
      isPrimary: z.boolean(),
    })
  ),
  assignmentsCount: z.number().int().nonnegative(),
})

export const createWorkerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(8).nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  workerType: z.string().min(2).optional(),
  hourlyRate: z.number().nonnegative().nullable().optional(),
  dailyRate: z.number().nonnegative().nullable().optional(),
  skills: z.array(z.string().min(2)).optional(),
  notes: z.string().min(2).nullable().optional(),
  roleIds: z.array(z.string()).optional(),
})

export const updateWorkerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(8).nullable().optional(),
  workerType: z.string().min(2).optional(),
  status: z.string().min(2).optional(),
  hourlyRate: z.number().nonnegative().nullable().optional(),
  dailyRate: z.number().nonnegative().nullable().optional(),
  skills: z.array(z.string().min(2)).optional(),
  notes: z.string().min(2).nullable().optional(),
})

export type Worker = z.infer<typeof workerSchema>
export type CreateWorkerInput = z.infer<typeof createWorkerSchema>
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>
