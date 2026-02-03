import { graphqlRequest } from "@/lib/api/graphql"
import type { Job } from "@/features/jobs/schemas"
import type { Payment } from "@/features/payments/schemas"

// Fetch all data needed for reports in a single query
export async function fetchReportData() {
  const query = `
    query ReportData {
      jobs(limit: 200, offset: 0) {
        id
        title
        status
        clientId
        createdAt
      }
      payments(limit: 200, offset: 0) {
        id
        jobId
        amount
        currency
        status
        createdAt
      }
      paymentsSummary {
        totalProcessed
        totalSucceeded
        totalPending
        totalFailed
      }
      jobsCount
      activeJobsCount: jobsCount(status: "in_progress")
      completedJobsCount: jobsCount(status: "completed")
    }
  `

  try {
    const data = await graphqlRequest<{
      jobs: Job[]
      payments: Payment[]
      paymentsSummary: {
        totalProcessed: number
        totalSucceeded: number
        totalPending: number
        totalFailed: number
      }
      jobsCount: number
      activeJobsCount: number
      completedJobsCount: number
    }>(query)

    return data
  } catch (error) {
    // Return empty data structure on error
    return {
      jobs: [] as Job[],
      payments: [] as Payment[],
      paymentsSummary: {
        totalProcessed: 0,
        totalSucceeded: 0,
        totalPending: 0,
        totalFailed: 0,
      },
      jobsCount: 0,
      activeJobsCount: 0,
      completedJobsCount: 0,
    }
  }
}

// Calculate revenue series for charts
export function calculateRevenueSeries(
  payments: Payment[],
  weeks: number = 4
): { label: string; value: number }[] {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (weeks - 1) * 7)

  return Array.from({ length: weeks }, (_, index) => {
    const from = new Date(start)
    from.setDate(start.getDate() + index * 7)
    const to = new Date(from)
    to.setDate(from.getDate() + 7)

    const value = payments
      .filter((payment) => {
        const created = new Date(payment.createdAt)
        return created >= from && created < to && payment.status === "paid"
      })
      .reduce((total, payment) => total + payment.amount, 0)

    return {
      label: `Sem ${index + 1}`,
      value,
    }
  })
}

// Calculate jobs by status for charts
export function calculateJobsByStatus(jobs: Job[]): { label: string; value: number }[] {
  const statusCount = jobs.reduce(
    (acc, job) => {
      const status = job.status ?? "pending"
      acc[status] = (acc[status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return [
    { label: "Pendente", value: statusCount.pending ?? 0 },
    { label: "Andamento", value: statusCount.in_progress ?? 0 },
    { label: "Concluido", value: statusCount.completed ?? 0 },
    { label: "Cancelado", value: statusCount.cancelled ?? 0 },
  ].filter(item => item.value > 0)
}

// Calculate top jobs by revenue
export function calculateTopJobsByRevenue(
  jobs: Job[],
  payments: Payment[],
  limit: number = 10
): {
  id: string
  name: string
  status: string
  revenue: number
}[] {
  const paymentsByJob = payments.reduce((acc, payment) => {
    if (!payment.jobId) return acc
    const current = acc.get(payment.jobId) ?? 0
    acc.set(payment.jobId, current + payment.amount)
    return acc
  }, new Map<string, number>())

  return jobs
    .map((job) => ({
      id: job.id,
      name: job.title,
      status: job.status ?? "pending",
      revenue: paymentsByJob.get(job.id) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

// Calculate metrics
export function calculateMetrics(
  jobs: Job[],
  paymentsSummary: {
    totalProcessed: number
    totalSucceeded: number
    totalPending: number
    totalFailed: number
  }
) {
  const totalJobs = jobs.length
  const activeJobs = jobs.filter((job) => job.status === "in_progress").length
  const completedJobs = jobs.filter((job) => job.status === "completed").length
  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0

  return {
    totalRevenue: paymentsSummary.totalProcessed,
    activeJobs,
    completedJobs,
    completionRate: Math.round(completionRate),
    // Satisfaction is a placeholder - would come from a reviews/feedback system
    satisfaction: 4.8,
  }
}
