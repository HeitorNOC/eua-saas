import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { EditWorkerForm } from "@/features/workforce/edit-worker-form"
import { fetchWorker } from "@/features/workforce/queries"
import { RequireRole } from "@/components/auth/require-role"

export default async function EditWorkerPage({
  params,
}: {
  params: { workerId: string }
}) {
  const { workerId } = params
  const worker = await fetchWorker(workerId)

  if (!worker) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <div className="space-y-6">
        <PageHeader
          title="Editar profissional"
          description="Atualize tipo, contato e habilidades."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <EditWorkerForm worker={worker} />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
