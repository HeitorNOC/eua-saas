"use server"

import { graphqlRequest } from "@/lib/api/graphql"
import {
  createJobSchema,
  updateJobSchema,
  type CreateJobInput,
  type Job,
  type UpdateJobInput,
} from "@/features/jobs/schemas"

export async function createJob(input: CreateJobInput) {
  const payload = createJobSchema.parse(input)
  const mutation = `
    mutation CreateJob($input: CreateJobInput!) {
      createJob(input: $input) {
        id
        title
        description
        status
        clientId
        createdAt
        updatedAt
      }
    }
  `

  const data = await graphqlRequest<{ createJob: Job }>(mutation, {
    input: payload,
  })
  return data.createJob
}

export async function updateJob(input: UpdateJobInput) {
  const payload = updateJobSchema.parse(input)
  const mutation = `
    mutation UpdateJob($id: ID!, $input: UpdateJobInput!) {
      updateJob(id: $id, input: $input) {
        id
        title
        description
        status
        clientId
        createdAt
        updatedAt
      }
    }
  `

  const { id, ...inputPayload } = payload
  const data = await graphqlRequest<{ updateJob: Job }>(mutation, {
    id,
    input: inputPayload,
  })
  return data.updateJob
}

export async function deleteJob(jobId: string) {
  const mutation = `
    mutation DeleteJob($id: ID!) {
      deleteJob(id: $id)
    }
  `

  const data = await graphqlRequest<{ deleteJob: boolean }>(mutation, {
    id: jobId,
  })
  return data.deleteJob
}
