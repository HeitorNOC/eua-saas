import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { EditPaymentForm } from "@/features/payments/edit-payment-form"
import { fetchPayment } from "@/features/payments/queries"
import { RequireRole } from "@/components/auth/require-role"

export default async function EditPaymentPage({
  params,
}: {
  params: { paymentId: string }
}) {
  const { paymentId } = params
  const payment = await fetchPayment(paymentId)

  if (!payment) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "finance"]}>
      <div className="space-y-6">
        <PageHeader
          title="Editar pagamento"
          description="Atualize status, método e data de pagamento."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <EditPaymentForm payment={payment} />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
