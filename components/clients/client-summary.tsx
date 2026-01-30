import { MetricCard } from "@/components/cards/metric-card"
import { formatCurrency } from "@/lib/formatters"
import type { Locale } from "@/config/site"

export function ClientSummary({
  locale,
  activeJobs,
  totalRevenue,
}: {
  locale: Locale
  activeJobs: number
  totalRevenue: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricCard label="Jobs ativos" value={String(activeJobs)} />
      <MetricCard
        label="Receita acumulada"
        value={formatCurrency(totalRevenue, locale, "BRL")}
      />
    </div>
  )
}
