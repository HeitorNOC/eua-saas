import { PageHeader, PageSection } from "@/components/page/page-header"
import { CreatePaymentForm } from "@/features/payments/create-payment-form"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function NewPaymentPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  return (
    <RequireRole roles={["owner", "admin", "finance"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.payments")}
          description="Registrar novo pagamento e condições."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <CreatePaymentForm />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
