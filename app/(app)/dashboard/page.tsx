import Link from "next/link"
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  DollarSignIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { createTranslator } from "@/lib/i18n/translator"
import { formatCurrency, formatPercentage } from "@/lib/formatters"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { MetricCard } from "@/components/cards/metric-card"
import { ActionCard } from "@/components/cards/action-card"
import { graphqlRequest } from "@/lib/api/graphql"
import { getLocaleFromCookies } from "@/lib/i18n/locale"
import { routes } from "@/lib/routes"

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
    <PageContainer>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        actions={
          <Button asChild>
            <Link href={routes.jobNew()}>{t("dashboard.newJob")}</Link>
          </Button>
        }
      />

      <PageSection>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t("dashboard.metric.activeJobs")}
            value={String(counts.active)}
            trend={{ value: 12, label: "vs mes anterior" }}
            icon={<BriefcaseIcon className="size-5" />}
          />
          <MetricCard
            label={t("dashboard.metric.completedThisMonth")}
            value={String(counts.completed)}
            helper="Total concluidos"
            icon={<CheckCircle2Icon className="size-5" />}
          />
          <MetricCard
            label={t("dashboard.metric.utilization")}
            value={formatPercentage(utilization, locale)}
            helper="Base de jobs ativos"
            icon={<TrendingUpIcon className="size-5" />}
          />
          <MetricCard
            label={t("dashboard.metric.revenue")}
            value={formatCurrency(
              payments.paymentsSummary.totalProcessed,
              locale,
              "BRL"
            )}
            helper="Processado"
            trend={{ value: 8 }}
            icon={<DollarSignIcon className="size-5" />}
          />
        </div>
      </PageSection>

      <PageSection title={t("dashboard.quickActions")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title={t("dashboard.newJob")}
            description="Abrir fluxo completo de job e orcamento."
            href={routes.jobNew()}
            icon={<ClipboardListIcon className="size-5" />}
          />
          <ActionCard
            title={t("dashboard.newClient")}
            description="Registrar contatos e preferencias do cliente."
            href={routes.clientNew()}
            icon={<UsersIcon className="size-5" />}
          />
          <ActionCard
            title={t("dashboard.newSchedule")}
            description="Reservar equipe e horarios prioritarios."
            href={routes.schedule}
            icon={<CalendarIcon className="size-5" />}
          />
        </div>
      </PageSection>
    </PageContainer>
  )
}
