import { graphqlRequest } from "@/lib/api/graphql"
import type { Client } from "@/features/clients/schemas"

const CLIENT_FIELDS = `
  id
  name
  email
  phone
  address
  createdAt
  updatedAt
`

export async function fetchClients(limit = 50, offset = 0) {
  const query = `
    query Clients($limit: Int, $offset: Int) {
      clients(limit: $limit, offset: $offset) {
        ${CLIENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ clients: Client[] }>(query, {
    limit,
    offset,
  })
  return data.clients
}

export async function fetchClientsCount() {
  const query = `
    query ClientsCount {
      clientsCount
    }
  `

  const data = await graphqlRequest<{ clientsCount: number }>(query)
  return data.clientsCount
}

export async function fetchClient(id: string) {
  const query = `
    query Client($id: ID!) {
      client(id: $id) {
        ${CLIENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ client: Client | null }>(query, { id })
  return data.client
}
