import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { EditJobForm } from "@/features/jobs/edit-job-form"
import { fetchJob } from "@/features/jobs/queries"
import { RequireRole } from "@/components/auth/require-role"

export default async function EditJobPage({
  params,
}: {
  params: { jobId: string }
}) {
  const { jobId } = params
  const job = await fetchJob(jobId)

  if (!job) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title="Editar job"
          description="Atualize informações operacionais e status."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <EditJobForm job={job} />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
