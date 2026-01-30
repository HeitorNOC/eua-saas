import { z } from "zod"

export const scheduleStatusSchema = z.enum([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
])

export const scheduleEventSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  status: scheduleStatusSchema,
  notes: z.string().optional(),
})

export const scheduleSchema = scheduleEventSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createScheduleEventSchema = scheduleEventSchema.omit({ id: true })
export const updateScheduleEventSchema = scheduleEventSchema.partial().extend({
  id: z.string().uuid(),
})

export type ScheduleEventInput = z.infer<typeof scheduleEventSchema>
export type CreateScheduleEventInput = z.infer<typeof createScheduleEventSchema>
export type UpdateScheduleEventInput = z.infer<typeof updateScheduleEventSchema>
export type Schedule = z.infer<typeof scheduleSchema>
