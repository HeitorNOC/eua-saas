import { PageHeader, PageSection } from "@/components/page/page-header"
import { CreateClientForm } from "@/features/clients/create-client-form"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function NewClientPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.clients")}
          description="Cadastro de cliente para novos contratos e jobs."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <CreateClientForm />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
