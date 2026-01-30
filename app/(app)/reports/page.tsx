import { Badge } from "@/components/ui/badge"
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
import { PageHeader, PageSection } from "@/components/page/page-header"
import { MiniAreaChart } from "@/components/reports/mini-area-chart"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { fetchJobs } from "@/features/jobs/queries"
import { fetchPayments, fetchPaymentsSummary } from "@/features/payments/queries"
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

  const metrics = [
    {
      id: "revenue",
      label: "Receita processada",
      value: formatCurrency(totalRevenue, locale, "BRL"),
      helper: "Pagamentos confirmados",
    },
    {
      id: "jobs",
      label: "Jobs ativos",
      value: String(activeJobs),
      helper: "Em andamento",
    },
    {
      id: "satisfaction",
      label: "Satisfação",
      value: "-",
      helper: "Sem dados",
    },
    {
      id: "sla",
      label: "SLA cumprido",
      value: "-",
      helper: "Sem dados",
    },
  ]

  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 27)

  const reportSeries = Array.from({ length: 4 }, (_, index) => {
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
      label: `Semana ${index + 1}`,
      value,
    }
  })

  const paymentsByJob = payments.reduce((acc, payment) => {
    if (!payment.jobId) {
      return acc
    }
    const current = acc.get(payment.jobId) ?? { jobs: 0, revenue: 0 }
    current.revenue += payment.amount
    acc.set(payment.jobId, current)
    return acc
  }, new Map<string, { jobs: number; revenue: number }>())

  const rows = jobs.map((job) => {
    const revenue = paymentsByJob.get(job.id)?.revenue ?? 0
    return {
      id: job.id,
      name: job.title,
      jobs: 1,
      revenue: formatCurrency(revenue, locale, "BRL"),
      trend: "-",
    }
  })
  type ReportRow = (typeof rows)[number]

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <div className="space-y-8">
        <PageHeader
          title={t("nav.reports")}
          description="Indicadores estratégicos baseados no reports-service."
          actions={<Button variant="outline">Exportar relatório</Button>}
        />
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <PageSection>
          {hasMetrics ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  helper={metric.helper}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="Sem dados" description="Nenhum indicador disponível." />
          )}
        </PageSection>

        <PageSection title="Tendência operacional">
          {hasSeries ? (
            <div className="rounded-lg border bg-card p-4">
              <MiniAreaChart data={reportSeries} />
            </div>
          ) : (
            <EmptyState title="Sem dados" description="Nenhuma série disponível." />
          )}
        </PageSection>

        <PageSection title="Comparativo por serviço">
          <ListToolbar
            searchPlaceholder="Buscar serviços"
            filters={
              <div className="flex items-center gap-2">
                <Select defaultValue="30d">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Worker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="wk-1">Equipe A</SelectItem>
                    <SelectItem value="wk-2">Equipe B</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="cli-1">Cliente Aurora</SelectItem>
                    <SelectItem value="cli-2">Cliente Sol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

          {rows.length ? (
            <DataTableClient<ReportRow>
              columns={[
                {
                  id: "service",
                  header: "Serviço",
                  cell: (row) => <span className="font-medium">{row.name}</span>,
                  accessor: (row) => row.name,
                  sortable: true,
                },
                {
                  id: "jobs",
                  header: "Jobs",
                  cell: (row) => row.jobs,
                  accessor: (row) => row.jobs,
                  sortable: true,
                },
                {
                  id: "revenue",
                  header: "Receita",
                  cell: (row) => row.revenue,
                  accessor: (row) => row.revenue,
                },
                {
                  id: "trend",
                  header: "Tendência",
                  cell: (row) => (
                    <Badge
                      variant={row.trend.startsWith("-") ? "outline" : "secondary"}
                    >
                      {row.trend}
                    </Badge>
                  ),
                  accessor: (row) => row.trend,
                  className: "text-right",
                },
              ]}
              data={rows}
              rowKey={(row) => row.id}
            />
          ) : (
            <EmptyState title="Sem dados" description="Nenhum comparativo disponível." />
          )}
        </PageSection>
      </div>
    </RequireRole>
  )
}
