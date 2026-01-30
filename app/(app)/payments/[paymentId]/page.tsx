import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { fetchPayment } from "@/features/payments/queries"
import { fetchJob } from "@/features/jobs/queries"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { RequireRole } from "@/components/auth/require-role"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function PaymentDetailsPage({
  params,
}: {
  params: { paymentId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { paymentId } = params
  const payment = await fetchPayment(paymentId)
  const jobTitle = payment?.jobId ? (await fetchJob(payment.jobId))?.title : null

  if (!payment) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "finance"]}>
      <div className="space-y-6">
        <PageHeader
          title={`Pagamento ${payment.id.slice(0, 6)}`}
          description="Detalhes do pagamento"
          actions={
            <Button asChild variant="outline">
              <Link href={routes.paymentEdit(payment.id)}>Editar</Link>
            </Button>
          }
        />

        <PageSection title="Resumo">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">Job</div>
              <div className="text-sm font-medium">{jobTitle ?? "Job"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Valor</div>
              <div className="text-sm font-medium">
                {formatCurrency(payment.amount, locale, payment.currency)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="text-sm font-medium">{payment.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Criado em</div>
              <div className="text-sm font-medium">
                {formatDate(payment.createdAt, locale)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Método</div>
              <div className="text-sm font-medium">{payment.method ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Pago em</div>
              <div className="text-sm font-medium">
                {payment.paidAt ? formatDate(payment.paidAt, locale) : "-"}
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
