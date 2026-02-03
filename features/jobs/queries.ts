import { cache } from "react"
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

// Cache de request-level usando React cache()
export const fetchJobs = cache(async (limit = 50, offset = 0) => {
  const query = `
    query Jobs($limit: Int, $offset: Int) {
      jobs(limit: $limit, offset: $offset) {
        ${JOB_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ jobs: Job[] }>(query, { limit, offset })
  return data.jobs
})

export const fetchJob = cache(async (id: string) => {
  const query = `
    query Job($id: ID!) {
      job(id: $id) {
        ${JOB_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ job: Job | null }>(query, { id })
  return data.job
})

export const fetchJobsCount = cache(async (status?: string) => {
  const query = `
    query JobsCount($status: String) {
      jobsCount(status: $status)
    }
  `

  const data = await graphqlRequest<{ jobsCount: number }>(query, { status })
  return data.jobsCount
})

// Buscar jobs por status com cache
export const fetchJobsByStatus = cache(async (status: string, limit = 50) => {
  const query = `
    query JobsByStatus($status: String!, $limit: Int) {
      jobs(status: $status, limit: $limit) {
        ${JOB_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ jobs: Job[] }>(query, { status, limit })
  return data.jobs
})

// Funcao para buscar jobs e contagem em paralelo
export async function fetchJobsWithCount(limit = 50, offset = 0, status?: string) {
  const [jobs, count] = await Promise.all([
    fetchJobs(limit, offset),
    fetchJobsCount(status),
  ])
  return { jobs, count }
}

// Buscar contagens de todos os status em paralelo
export async function fetchJobStatusCounts() {
  const statuses = ["pending", "in_progress", "completed", "cancelled"]
  const counts = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await fetchJobsCount(status),
    }))
  )
  return Object.fromEntries(counts.map(({ status, count }) => [status, count]))
}
