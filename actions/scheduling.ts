"use server"

import { graphqlRequest } from "@/lib/api/graphql"
import {
  createScheduleEventSchema,
  updateScheduleEventSchema,
  type CreateScheduleEventInput,
  type ScheduleEventInput,
  type UpdateScheduleEventInput,
} from "@/features/scheduling/schemas"

export async function createScheduleEvent(input: CreateScheduleEventInput) {
  const payload = createScheduleEventSchema.parse(input)
  const mutation = `
    mutation CreateSchedule($input: CreateScheduleInput!) {
      createSchedule(input: $input) {
        id
        jobId
        startTime
        endTime
        status
        notes
      }
    }
  `

  const data = await graphqlRequest<{ createSchedule: ScheduleEventInput }>(
    mutation,
    { input: payload }
  )
  return data.createSchedule
}

export async function updateScheduleEvent(input: UpdateScheduleEventInput) {
  const payload = updateScheduleEventSchema.parse(input)
  const mutation = `
    mutation UpdateSchedule($id: ID!, $input: UpdateScheduleInput!) {
      updateSchedule(id: $id, input: $input) {
        id
        jobId
        startTime
        endTime
        status
        notes
      }
    }
  `

  const { id, ...inputPayload } = payload
  const data = await graphqlRequest<{ updateSchedule: ScheduleEventInput }>(
    mutation,
    { id, input: inputPayload }
  )
  return data.updateSchedule
}

export async function deleteScheduleEvent(eventId: string) {
  const mutation = `
    mutation DeleteSchedule($id: ID!) {
      deleteSchedule(id: $id)
    }
  `

  const data = await graphqlRequest<{ deleteSchedule: boolean }>(mutation, {
    id: eventId,
  })
  return data.deleteSchedule
}
