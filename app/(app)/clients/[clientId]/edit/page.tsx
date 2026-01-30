import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { EditClientForm } from "@/features/clients/edit-client-form"
import { fetchClient } from "@/features/clients/queries"
import { RequireRole } from "@/components/auth/require-role"

export default async function EditClientPage({
  params,
}: {
  params: { clientId: string }
}) {
  const { clientId } = params
  const client = await fetchClient(clientId)

  if (!client) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title="Editar cliente"
          description="Atualize dados de contato e endereço."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <EditClientForm client={client} />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
