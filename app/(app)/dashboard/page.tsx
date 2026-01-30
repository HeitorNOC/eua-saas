import Link from "next/link"
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  DollarSignIcon,
  TrendingUpIcon,
  PlusIcon,
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
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/activity-feed"
import { graphqlRequest } from "@/lib/api/graphql"
import { getLocaleFromCookies } from "@/lib/i18n/locale"
import { routes } from "@/lib/routes"

// Mock activities - em producao viriam do backend
function getMockActivities(): ActivityItem[] {
  const now = new Date()
  return [
    {
      id: "1",
      type: "job_completed",
      title: "Job #1234 concluido",
      description: "Instalacao eletrica residencial - Cliente Silva",
      timestamp: new Date(now.getTime() - 1000 * 60 * 15), // 15 min atras
    },
    {
      id: "2",
      type: "payment_received",
      title: "Pagamento recebido",
      description: "R$ 2.500,00 - Job #1230",
      timestamp: new Date(now.getTime() - 1000 * 60 * 45), // 45 min atras
    },
    {
      id: "3",
      type: "client_added",
      title: "Novo cliente cadastrado",
      description: "Empresa ABC Ltda",
      timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2h atras
    },
    {
      id: "4",
      type: "schedule_updated",
      title: "Agendamento atualizado",
      description: "Job #1232 remarcado para amanha",
      timestamp: new Date(now.getTime() - 1000 * 60 * 180), // 3h atras
    },
    {
      id: "5",
      type: "job_created",
      title: "Novo job criado",
      description: "Manutencao preventiva - Cliente Oliveira",
      timestamp: new Date(now.getTime() - 1000 * 60 * 240), // 4h atras
    },
  ]
}

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
  const activities = getMockActivities()

  return (
    <PageContainer>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        actions={
          <Button asChild>
            <Link href={routes.jobNew()}>
              <PlusIcon className="mr-2 size-4" />
              {t("dashboard.newJob")}
            </Link>
          </Button>
        }
      />

      {/* Quick Actions */}
      <PageSection>
        <QuickActions />
      </PageSection>

      {/* Stats Grid */}
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

      {/* Activity Feed */}
      <PageSection title="Atividade Recente">
        <div className="rounded-xl border bg-card">
          <ActivityFeed activities={activities} />
        </div>
      </PageSection>
    </PageContainer>
  )
}
