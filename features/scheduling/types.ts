export type ScheduleEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource?: {
    jobId?: string
    workerId?: string
    status?: "scheduled" | "in_progress" | "completed"
  }
}
