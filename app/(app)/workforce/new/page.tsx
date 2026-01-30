import { PageHeader, PageSection } from "@/components/page/page-header"
import { CreateWorkerForm } from "@/features/workforce/create-worker-form"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function NewWorkerPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.workforce")}
          description="Cadastro de novos profissionais e habilidades."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <CreateWorkerForm />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
