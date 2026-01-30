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

export async function fetchPayments(limit = 50, offset = 0, jobId?: string | null) {
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
}

export async function fetchPayment(id: string) {
  const query = `
    query Payment($id: ID!) {
      payment(id: $id) {
        ${PAYMENT_FIELDS}
      }
    }
  `

  const data = await graphqlRequest<{ payment: Payment | null }>(query, { id })
  return data.payment
}

export async function fetchPaymentsSummary() {
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
}

export async function fetchPaymentsCount(status?: string) {
  const query = `
    query PaymentsCount($status: String) {
      paymentsCount(status: $status)
    }
  `

  const data = await graphqlRequest<{ paymentsCount: number }>(query, { status })
  return data.paymentsCount
}
