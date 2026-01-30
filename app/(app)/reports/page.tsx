import {
  BarChart3Icon,
  BriefcaseIcon,
  DollarSignIcon,
  DownloadIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MetricCard } from "@/components/cards/metric-card"
import { DataTableClient } from "@/components/page/data-table-client"
import { ListToolbar } from "@/components/page/list-toolbar"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { fetchJobs } from "@/features/jobs/queries"
import {
  fetchPayments,
  fetchPaymentsSummary,
} from "@/features/payments/queries"
import { formatCurrency } from "@/lib/formatters"
import { EmptyState } from "@/components/page/empty-state"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ApiError } from "@/lib/api/error"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function ReportsPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  let jobs = [] as Awaited<ReturnType<typeof fetchJobs>>
  let payments = [] as Awaited<ReturnType<typeof fetchPayments>>
  let paymentsSummary = {
    totalProcessed: 0,
    totalSucceeded: 0,
    totalPending: 0,
    totalFailed: 0,
  }
  let error: string | null = null

  try {
    ;[jobs, payments, paymentsSummary] = await Promise.all([
      fetchJobs(200, 0),
      fetchPayments(200, 0),
      fetchPaymentsSummary(),
    ])
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message
    }
  }

  const activeJobs = jobs.filter((job) => job.status !== "completed").length
  const totalRevenue = paymentsSummary.totalProcessed
  const hasMetrics = jobs.length > 0 || payments.length > 0
  const hasSeries = payments.length > 0

  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 27)

  const revenueSeries = Array.from({ length: 4 }, (_, index) => {
    const from = new Date(start)
    from.setDate(start.getDate() + index * 7)
    const to = new Date(from)
    to.setDate(from.getDate() + 7)

    const value = payments
      .filter((payment) => {
        const created = new Date(payment.createdAt)
        return created >= from && created < to
      })
      .reduce((total, payment) => total + payment.amount, 0)

    return {
      label: `Sem ${index + 1}`,
      value,
    }
  })

  const jobsByStatus = jobs.reduce(
    (acc, job) => {
      const status = job.status ?? "pending"
      acc[status] = (acc[status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const statusData = [
    { label: "Pendente", value: jobsByStatus.pending ?? 0 },
    { label: "Andamento", value: jobsByStatus.in_progress ?? 0 },
    { label: "Concluido", value: jobsByStatus.completed ?? 0 },
  ]

  const paymentsByJob = payments.reduce((acc, payment) => {
    if (!payment.jobId) return acc
    const current = acc.get(payment.jobId) ?? { revenue: 0 }
    current.revenue += payment.amount
    acc.set(payment.jobId, current)
    return acc
  }, new Map<string, { revenue: number }>())

  const rows = jobs
    .map((job) => {
      const revenue = paymentsByJob.get(job.id)?.revenue ?? 0
      return {
        id: job.id,
        name: job.title,
        status: job.status ?? "pending",
        revenue,
        revenueFormatted: formatCurrency(revenue, locale, "BRL"),
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  type ReportRow = (typeof rows)[number]

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <PageContainer>
        <PageHeader
          title={t("nav.reports")}
          description="Indicadores estrategicos e analises operacionais."
          actions={
            <Button variant="outline">
              <DownloadIcon className="mr-2 size-4" />
              Exportar relatorio
            </Button>
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <PageSection>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Receita processada"
              value={formatCurrency(totalRevenue, locale, "BRL")}
              helper="Pagamentos confirmados"
              trend={{ value: 12 }}
              icon={<DollarSignIcon className="size-5" />}
            />
            <MetricCard
              label="Jobs ativos"
              value={String(activeJobs)}
              helper="Em andamento"
              icon={<BriefcaseIcon className="size-5" />}
            />
            <MetricCard
              label="Satisfacao"
              value="4.8"
              helper="Media de avaliacoes"
              icon={<StarIcon className="size-5" />}
            />
            <MetricCard
              label="Taxa de conclusao"
              value={
                jobs.length > 0
                  ? `${Math.round(((jobsByStatus.completed ?? 0) / jobs.length) * 100)}%`
                  : "-"
              }
              helper="Jobs concluidos"
              icon={<TrendingUpIcon className="size-5" />}
            />
          </div>
        </PageSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <PageSection
            title="Receita semanal"
            description="Ultimas 4 semanas"
          >
            <div className="rounded-lg border bg-card p-4">
              {hasSeries ? (
                <AreaChart data={revenueSeries} height={240} />
              ) : (
                <EmptyState
                  title="Sem dados"
                  description="Nenhuma serie disponivel."
                  className="py-8"
                />
              )}
            </div>
          </PageSection>

          <PageSection title="Jobs por status" description="Distribuicao atual">
            <div className="rounded-lg border bg-card p-4">
              {hasMetrics ? (
                <BarChart data={statusData} height={240} />
              ) : (
                <EmptyState
                  title="Sem dados"
                  description="Nenhum job disponivel."
                  className="py-8"
                />
              )}
            </div>
          </PageSection>
        </div>

        <PageSection title="Top jobs por receita">
          <ListToolbar
            searchPlaceholder="Buscar jobs..."
            filters={
              <div className="flex items-center gap-2">
                <Select defaultValue="30d">
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

          {rows.length > 0 ? (
            <DataTableClient<ReportRow>
              columns={[
                {
                  id: "name",
                  header: "Job",
                  cell: (row) => (
                    <span className="font-medium">{row.name}</span>
                  ),
                  accessor: (row) => row.name,
                  sortable: true,
                },
                {
                  id: "status",
                  header: "Status",
                  cell: (row) => (
                    <span className="rounded-md bg-muted px-2 py-1 text-xs capitalize">
                      {row.status.replace("_", " ")}
                    </span>
                  ),
                  accessor: (row) => row.status,
                  sortable: true,
                },
                {
                  id: "revenue",
                  header: "Receita",
                  cell: (row) => (
                    <span className="font-medium tabular-nums">
                      {row.revenueFormatted}
                    </span>
                  ),
                  accessor: (row) => row.revenue,
                  sortable: true,
                  className: "text-right",
                  headerClassName: "text-right",
                },
              ]}
              data={rows}
              rowKey={(row) => row.id}
            />
          ) : (
            <EmptyState
              title="Sem dados"
              description="Nenhum comparativo disponivel."
              icon={<BarChart3Icon className="size-6" />}
            />
          )}
        </PageSection>
      </PageContainer>
    </RequireRole>
  )
}
