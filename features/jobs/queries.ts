import { graphqlRequest } from "@/lib/api/graphql"
import type { Job } from "@/features/jobs/schemas"

const JOB_FIELDS = `
  id
  title
  description
  status
  clientId
  createdAt
  updatedAt
`

export async function fetchJobs(limit = 50, offset = 0) {
  const query = `
    query Jobs($limit: Int, $offset: Int) {
      jobs(limit: $limit, offset: $offset) {
        ${JOB_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ jobs: Job[] }>(query, { limit, offset })
  return data.jobs
}

export async function fetchJob(id: string) {
  const query = `
    query Job($id: ID!) {
      job(id: $id) {
        ${JOB_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ job: Job | null }>(query, { id })
  return data.job
}

export async function fetchJobsCount(status?: string) {
  const query = `
    query JobsCount($status: String) {
      jobsCount(status: $status)
    }
  `

  const data = await graphqlRequest<{ jobsCount: number }>(query, { status })
  return data.jobsCount
}
