"use server"

import { graphqlRequest } from "@/lib/api/graphql"
import {
  createPaymentSchema,
  updatePaymentSchema,
  type Payment,
  type CreatePaymentInput,
  type UpdatePaymentInput,
} from "@/features/payments/schemas"

export async function createPayment(input: CreatePaymentInput) {
  const payload = createPaymentSchema.parse(input)
  const mutation = `
    mutation CreatePayment($input: CreatePaymentInput!) {
      createPayment(input: $input) {
        id
        jobId
        amount
        currency
        status
        method
        paidAt
        createdAt
        updatedAt
      }
    }
  `

  const data = await graphqlRequest<{ createPayment: Payment }>(mutation, {
    input: payload,
  })
  return data.createPayment
}

export async function updatePayment(input: UpdatePaymentInput) {
  const payload = updatePaymentSchema.parse(input)
  const mutation = `
    mutation UpdatePayment($id: ID!, $input: UpdatePaymentInput!) {
      updatePayment(id: $id, input: $input) {
        id
        jobId
        amount
        currency
        status
        method
        paidAt
        createdAt
        updatedAt
      }
    }
  `

  const { id, ...inputPayload } = payload
  const data = await graphqlRequest<{ updatePayment: Payment }>(mutation, {
    id,
    input: inputPayload,
  })
  return data.updatePayment
}

export async function deletePayment(paymentId: string) {
  const mutation = `
    mutation DeletePayment($id: ID!) {
      deletePayment(id: $id)
    }
  `

  const data = await graphqlRequest<{ deletePayment: boolean }>(mutation, {
    id: paymentId,
  })
  return data.deletePayment
}
