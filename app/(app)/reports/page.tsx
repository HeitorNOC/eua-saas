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
import { formatCurrency } from "@/lib/formatters"
import { EmptyState } from "@/components/page/empty-state"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getLocaleFromCookies } from "@/lib/i18n/locale"
import {
  fetchReportData,
  calculateRevenueSeries,
  calculateJobsByStatus,
  calculateTopJobsByRevenue,
  calculateMetrics,
} from "@/features/reports/queries"

export default async function ReportsPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  
  let error: string | null = null
  let reportData = await fetchReportData()
  
  // Check if we got any data
  const hasData = reportData.jobs.length > 0 || reportData.payments.length > 0
  
  // Calculate all report data
  const metrics = calculateMetrics(reportData.jobs, reportData.paymentsSummary)
  const revenueSeries = calculateRevenueSeries(reportData.payments, 4)
  const jobsByStatus = calculateJobsByStatus(reportData.jobs)
  const topJobs = calculateTopJobsByRevenue(reportData.jobs, reportData.payments, 10)
  
  // Check if we have chart data
  const hasRevenueSeries = revenueSeries.some(item => item.value > 0)
  const hasJobsData = jobsByStatus.length > 0

  type ReportRow = (typeof topJobs)[number]

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

        {/* Key Metrics */}
        <PageSection>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Receita processada"
              value={formatCurrency(metrics.totalRevenue, locale, "BRL")}
              helper="Pagamentos confirmados"
              trend={{ value: 12 }}
              icon={<DollarSignIcon className="size-5" />}
            />
            <MetricCard
              label="Jobs ativos"
              value={String(metrics.activeJobs)}
              helper="Em andamento"
              icon={<BriefcaseIcon className="size-5" />}
            />
            <MetricCard
              label="Satisfacao"
              value={String(metrics.satisfaction)}
              helper="Media de avaliacoes"
              icon={<StarIcon className="size-5" />}
            />
            <MetricCard
              label="Taxa de conclusao"
              value={metrics.completionRate > 0 ? `${metrics.completionRate}%` : "-"}
              helper="Jobs concluidos"
              icon={<TrendingUpIcon className="size-5" />}
            />
          </div>
        </PageSection>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PageSection
            title="Receita semanal"
            description="Ultimas 4 semanas"
          >
            <div className="rounded-lg border bg-card p-4">
              {hasRevenueSeries ? (
                <AreaChart data={revenueSeries} height={240} />
              ) : (
                <EmptyState
                  title="Sem dados de receita"
                  description="Nenhum pagamento registrado no periodo."
                  className="py-8"
                />
              )}
            </div>
          </PageSection>

          <PageSection title="Jobs por status" description="Distribuicao atual">
            <div className="rounded-lg border bg-card p-4">
              {hasJobsData ? (
                <BarChart data={jobsByStatus} height={240} />
              ) : (
                <EmptyState
                  title="Sem dados de jobs"
                  description="Nenhum job disponivel para analise."
                  className="py-8"
                />
              )}
            </div>
          </PageSection>
        </div>

        {/* Top Jobs Table */}
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

          {topJobs.length > 0 ? (
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
                      {formatCurrency(row.revenue, locale, "BRL")}
                    </span>
                  ),
                  accessor: (row) => row.revenue,
                  sortable: true,
                  className: "text-right",
                  headerClassName: "text-right",
                },
              ]}
              data={topJobs}
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
