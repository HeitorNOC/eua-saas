import { cache } from "react"
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

// Cache de request-level usando React cache()
// Evita multiplas chamadas para a mesma query dentro de uma requisicao
export const fetchClients = cache(async (limit = 50, offset = 0) => {
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
})

export const fetchClientsCount = cache(async () => {
  const query = `
    query ClientsCount {
      clientsCount
    }
  `

  const data = await graphqlRequest<{ clientsCount: number }>(query)
  return data.clientsCount
})

export const fetchClient = cache(async (id: string) => {
  const query = `
    query Client($id: ID!) {
      client(id: $id) {
        ${CLIENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ client: Client | null }>(query, { id })
  return data.client
})

// Funcao para buscar clientes e contagem em paralelo
export async function fetchClientsWithCount(limit = 50, offset = 0) {
  const [clients, count] = await Promise.all([
    fetchClients(limit, offset),
    fetchClientsCount(),
  ])
  return { clients, count }
}
