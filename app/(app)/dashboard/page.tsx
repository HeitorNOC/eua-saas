import { Button } from "@/components/ui/button"
import { createTranslator } from "@/lib/i18n/translator"
import { formatCurrency, formatPercentage } from "@/lib/formatters"
import { PageHeader, PageSection } from "@/components/page/page-header"
import { MetricCard } from "@/components/cards/metric-card"
import { graphqlRequest } from "@/lib/api/graphql"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function DashboardPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  const countsQuery = `
    query DashboardCounts($active: String, $completed: String) {
      active: jobsCount(status: $active)
      completed: jobsCount(status: $completed)
      total: jobsCount
    }
  `

  const paymentsQuery = `
    query DashboardPayments {
      paymentsSummary {
        totalProcessed
      }
    }
  `

  let counts = { active: 0, completed: 0, total: 0 }
  let payments = { paymentsSummary: { totalProcessed: 0 } }

  try {
    ;[counts, payments] = await Promise.all([
      graphqlRequest<{ active: number; completed: number; total: number }>(
        countsQuery,
        { active: "in_progress", completed: "completed" }
      ),
      graphqlRequest<{ paymentsSummary: { totalProcessed: number } }>(
        paymentsQuery
      ),
    ])
  } catch {
    // fallback to zeros on failure
  }

  const utilization = counts.total ? counts.active / counts.total : 0

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        actions={<Button>{t("dashboard.newJob")}</Button>}
      />

      <PageSection>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t("dashboard.metric.activeJobs")}
            value={String(counts.active)}
          />
          <MetricCard
            label={t("dashboard.metric.completedThisMonth")}
            value={String(counts.completed)}
            helper="Total concluídos"
          />
          <MetricCard
            label={t("dashboard.metric.utilization")}
            value={formatPercentage(utilization, locale)}
            helper="Base de jobs ativos"
          />
          <MetricCard
            label={t("dashboard.metric.revenue")}
            value={formatCurrency(payments.paymentsSummary.totalProcessed, locale, "BRL")}
            helper="Processado"
          />
        </div>
      </PageSection>

      <PageSection title={t("dashboard.quickActions")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" className="h-auto justify-start p-4">
            <div className="space-y-1 text-left">
              <div className="text-sm font-semibold">
                {t("dashboard.newJob")}
              </div>
              <div className="text-muted-foreground text-xs">
                Abrir fluxo completo de job e orçamento.
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto justify-start p-4">
            <div className="space-y-1 text-left">
              <div className="text-sm font-semibold">
                {t("dashboard.newClient")}
              </div>
              <div className="text-muted-foreground text-xs">
                Registrar contatos e preferências do cliente.
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto justify-start p-4">
            <div className="space-y-1 text-left">
              <div className="text-sm font-semibold">
                {t("dashboard.newSchedule")}
              </div>
              <div className="text-muted-foreground text-xs">
                Reservar equipe e horários prioritários.
              </div>
            </div>
          </Button>
        </div>
      </PageSection>
    </div>
  )
}
