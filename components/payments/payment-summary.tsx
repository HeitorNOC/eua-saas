import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  WalletIcon,
} from "lucide-react"

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
        helper="Todos os pagamentos"
        icon={<WalletIcon className="size-5" />}
      />
      <MetricCard
        label="Pendente"
        value={formatCurrency(pending, locale, "BRL")}
        helper="Aguardando pagamento"
        icon={<ClockIcon className="size-5" />}
      />
      <MetricCard
        label="Recebido"
        value={formatCurrency(paid, locale, "BRL")}
        helper="Pagamentos confirmados"
        icon={<CheckCircle2Icon className="size-5" />}
      />
      <MetricCard
        label="Falhou"
        value={formatCurrency(failed, locale, "BRL")}
        helper="Pagamentos recusados"
        icon={<AlertTriangleIcon className="size-5" />}
      />
    </div>
  )
}
