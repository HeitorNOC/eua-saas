import { cache } from "react"
import { graphqlRequest } from "@/lib/api/graphql"
import type { Schedule } from "@/features/scheduling/schemas"

const SCHEDULE_FIELDS = `
  id
  jobId
  startTime
  endTime
  status
  notes
  createdAt
  updatedAt
`

// Cache de request-level usando React cache()
export const fetchSchedules = cache(async (limit = 50, offset = 0, jobId?: string | null) => {
  const query = `
    query Schedules($limit: Int, $offset: Int, $jobId: ID) {
      schedules(limit: $limit, offset: $offset, jobId: $jobId) {
        ${SCHEDULE_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ schedules: Schedule[] }>(query, {
    limit,
    offset,
    jobId: jobId ?? undefined,
  })
  return data.schedules
})

export const fetchSchedule = cache(async (id: string) => {
  const query = `
    query Schedule($id: ID!) {
      schedule(id: $id) {
        ${SCHEDULE_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ schedule: Schedule | null }>(query, { id })
  return data.schedule
})

export const fetchSchedulesCount = cache(async (jobId?: string) => {
  const query = `
    query SchedulesCount($jobId: ID) {
      schedulesCount(jobId: $jobId)
    }
  `

  const data = await graphqlRequest<{ schedulesCount: number }>(query, { jobId })
  return data.schedulesCount
})

// Buscar agendamentos por periodo
export const fetchSchedulesByDateRange = cache(async (startDate: string, endDate: string) => {
  const query = `
    query SchedulesByDateRange($startDate: String!, $endDate: String!) {
      schedules(startDate: $startDate, endDate: $endDate) {
        ${SCHEDULE_FIELDS}
        job {
          id
          title
          clientId
        }
      }
    }
  `

  const data = await graphqlRequest<{ 
    schedules: (Schedule & { job: { id: string; title: string; clientId: string } })[] 
  }>(query, { startDate, endDate })
  return data.schedules
})

// Funcao para buscar schedules e contagem em paralelo
export async function fetchSchedulesWithCount(limit = 50, offset = 0, jobId?: string) {
  const [schedules, count] = await Promise.all([
    fetchSchedules(limit, offset, jobId),
    fetchSchedulesCount(jobId),
  ])
  return { schedules, count }
}
