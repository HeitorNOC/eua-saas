import { cache } from "react"
import { graphqlRequest } from "@/lib/api/graphql"
import type { Payment } from "@/features/payments/schemas"

const PAYMENT_FIELDS = `
  id
  jobId
  amount
  currency
  status
  method
  paidAt
  createdAt
  updatedAt
`

// Cache de request-level usando React cache()
export const fetchPayments = cache(async (limit = 50, offset = 0, jobId?: string | null) => {
  const query = `
    query Payments($limit: Int, $offset: Int, $jobId: ID) {
      payments(limit: $limit, offset: $offset, jobId: $jobId) {
        ${PAYMENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ payments: Payment[] }>(query, {
    limit,
    offset,
    jobId: jobId ?? undefined,
  })
  return data.payments
})

export const fetchPayment = cache(async (id: string) => {
  const query = `
    query Payment($id: ID!) {
      payment(id: $id) {
        ${PAYMENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ payment: Payment | null }>(query, { id })
  return data.payment
})

export const fetchPaymentsSummary = cache(async () => {
  const query = `
    query PaymentsSummary {
      paymentsSummary {
        totalProcessed
        totalSucceeded
        totalPending
        totalFailed
      }
    }
  `

  const data = await graphqlRequest<{
    paymentsSummary: {
      totalProcessed: number
      totalSucceeded: number
      totalPending: number
      totalFailed: number
    }
  }>(query)

  return data.paymentsSummary
})

export const fetchPaymentsCount = cache(async (status?: string) => {
  const query = `
    query PaymentsCount($status: String) {
      paymentsCount(status: $status)
    }
  `

  const data = await graphqlRequest<{ paymentsCount: number }>(query, { status })
  return data.paymentsCount
})

// Funcao para buscar pagamentos e resumo em paralelo
export async function fetchPaymentsWithSummary(limit = 50, offset = 0) {
  const [payments, summary] = await Promise.all([
    fetchPayments(limit, offset),
    fetchPaymentsSummary(),
  ])
  return { payments, summary }
}
