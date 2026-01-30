import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { fetchJob } from "@/features/jobs/queries"
import { formatDate } from "@/lib/formatters"
import { RequireRole } from "@/components/auth/require-role"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function JobDetailsPage({
  params,
}: {
  params: { jobId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { jobId } = params
  const job = await fetchJob(jobId)

  if (!job) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={job.title}
          description="Detalhes operacionais do job"
          actions={
            <Button asChild variant="outline">
              <Link href={routes.jobEdit(job.id)}>Editar</Link>
            </Button>
          }
        />

        <PageSection title="Resumo">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="text-sm font-medium">{job.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Cliente</div>
              <div className="text-sm font-medium">{job.clientId ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Criado em</div>
              <div className="text-sm font-medium">
                {job.createdAt ? formatDate(job.createdAt, locale) : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Atualizado em</div>
              <div className="text-sm font-medium">
                {job.updatedAt ? formatDate(job.updatedAt, locale) : "-"}
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection title="Descrição">
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            {job.description ?? "Sem descrição"}
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
