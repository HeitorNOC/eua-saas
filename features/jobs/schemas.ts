import { z } from "zod"

export const jobStatusSchema = z.enum([
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
])

export const jobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().optional(),
  status: jobStatusSchema.optional(),
  clientId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const createJobSchema = jobSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
})

export const updateJobSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: jobStatusSchema.optional(),
  })

export type Job = z.infer<typeof jobSchema>
export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
