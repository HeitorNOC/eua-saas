"use server"

import { graphqlRequest } from "@/lib/api/graphql"
import {
  createClientSchema,
  updateClientSchema,
  type Client,
  type CreateClientInput,
  type UpdateClientInput,
} from "@/features/clients/schemas"

export async function createClient(input: CreateClientInput) {
  const payload = createClientSchema.parse(input)
  const mutation = `
    mutation CreateClient($input: CreateClientInput!) {
      createClient(input: $input) {
        id
        name
        email
        phone
        address
        createdAt
        updatedAt
      }
    }
  `

  const data = await graphqlRequest<{ createClient: Client }>(mutation, {
    input: payload,
  })
  return data.createClient
}

export async function updateClient(input: UpdateClientInput) {
  const payload = updateClientSchema.parse(input)
  const mutation = `
    mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
      updateClient(id: $id, input: $input) {
        id
        name
        email
        phone
        address
        createdAt
        updatedAt
      }
    }
  `

  const { id, ...inputPayload } = payload
  const data = await graphqlRequest<{ updateClient: Client }>(mutation, {
    id,
    input: inputPayload,
  })
  return data.updateClient
}

export async function deleteClient(clientId: string) {
  const mutation = `
    mutation DeleteClient($id: ID!) {
      deleteClient(id: $id)
    }
  `

  const data = await graphqlRequest<{ deleteClient: boolean }>(mutation, {
    id: clientId,
  })
  return data.deleteClient
}
