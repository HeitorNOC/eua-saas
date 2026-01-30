import { graphqlRequest } from "@/lib/api/graphql"
import type { Worker } from "@/features/workforce/schemas"

const WORKER_FIELDS = `
  id
  name
  email
  phone
  userId
  workerType
  hourlyRate
  dailyRate
  skills
  notes
  status
  createdAt
  updatedAt
  assignmentsCount
  roles {
    isPrimary
    role {
      id
      name
      description
    }
  }
`

export async function fetchWorkers(limit = 50, offset = 0) {
  const query = `
    query Workers($limit: Int, $offset: Int) {
      workers(limit: $limit, offset: $offset) {
        ${WORKER_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ workers: Worker[] }>(query, {
    limit,
    offset,
  })
  return data.workers
}

export async function fetchWorker(id: string) {
  const query = `
    query Worker($id: ID!) {
      worker(id: $id) {
        ${WORKER_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ worker: Worker | null }>(query, { id })
  return data.worker
}

export async function fetchWorkerAssignments(workerId: string) {
  const query = `
    query WorkerAssignments($workerId: ID!) {
      workerAssignments(workerId: $workerId) {
        id
        status
        createdAt
        role {
          id
          name
          description
        }
      }
    }
  `

  const data = await graphqlRequest<{
    workerAssignments: Array<{
      id: string
      status: string
      createdAt: string
      role: { id: string; name: string; description?: string | null }
    }>
  }>(query, { workerId })
  return data.workerAssignments
}

export async function fetchWorkersCount(status?: string) {
  const query = `
    query WorkersCount($status: String) {
      workersCount(status: $status)
    }
  `

  const data = await graphqlRequest<{ workersCount: number }>(query, { status })
  return data.workersCount
}
