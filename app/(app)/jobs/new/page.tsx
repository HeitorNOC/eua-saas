import { PageHeader, PageSection } from "@/components/page/page-header"
import { CreateJobForm } from "@/features/jobs/create-job-form"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function NewJobPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("jobs.create")}
          description="Crie um job completo com escopo, equipe e agenda."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <CreateJobForm />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
