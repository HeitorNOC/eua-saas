import { MetricCard } from "@/components/cards/metric-card"
import { formatCurrency } from "@/lib/formatters"
import type { Locale } from "@/config/site"

export function PaymentSummary({
  locale,
  total,
  pending,
  paid,
  failed,
}: {
  locale: Locale
  total: number
  pending: number
  paid: number
  failed: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Receita total"
        value={formatCurrency(total, locale, "BRL")}
      />
      <MetricCard
        label="Pendente"
        value={formatCurrency(pending, locale, "BRL")}
      />
      <MetricCard
        label="Pago"
        value={formatCurrency(paid, locale, "BRL")}
      />
      <MetricCard
        label="Falhou"
        value={formatCurrency(failed, locale, "BRL")}
      />
    </div>
  )
}
