"use server"

import { graphqlRequest } from "@/lib/api/graphql"
import {
  createWorkerSchema,
  updateWorkerSchema,
  type Worker,
  type CreateWorkerInput,
  type UpdateWorkerInput,
} from "@/features/workforce/schemas"

export async function createWorker(input: CreateWorkerInput) {
  const payload = createWorkerSchema.parse(input)
  const mutation = `
    mutation CreateWorker($input: CreateWorkerInput!) {
      createWorker(input: $input) {
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
      }
    }
  `

  const data = await graphqlRequest<{ createWorker: Worker }>(mutation, {
    input: payload,
  })
  return data.createWorker
}

export async function updateWorker(input: UpdateWorkerInput) {
  const payload = updateWorkerSchema.parse(input)
  const mutation = `
    mutation UpdateWorker($id: ID!, $input: UpdateWorkerInput!) {
      updateWorker(id: $id, input: $input) {
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
      }
    }
  `

  const { id, ...inputPayload } = payload
  const data = await graphqlRequest<{ updateWorker: Worker }>(mutation, {
    id,
    input: inputPayload,
  })
  return data.updateWorker
}

export async function deleteWorker(workerId: string) {
  const mutation = `
    mutation ArchiveWorker($id: ID!) {
      archiveWorker(id: $id) {
        id
        status
      }
    }
  `

  const data = await graphqlRequest<{ archiveWorker: Worker }>(mutation, {
    id: workerId,
  })
  return data.archiveWorker
}
