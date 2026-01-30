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

export async function fetchSchedules(limit = 50, offset = 0, jobId?: string | null) {
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
}

export async function fetchSchedule(id: string) {
  const query = `
    query Schedule($id: ID!) {
      schedule(id: $id) {
        ${SCHEDULE_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ schedule: Schedule | null }>(query, { id })
  return data.schedule
}
