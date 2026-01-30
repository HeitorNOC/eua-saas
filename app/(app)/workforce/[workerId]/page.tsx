import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { fetchWorker, fetchWorkerAssignments } from "@/features/workforce/queries"
import { RequireRole } from "@/components/auth/require-role"
import { WorkerSummary } from "@/components/workforce/worker-summary"
import { DataTableClient } from "@/components/page/data-table-client"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatters"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function WorkerDetailsPage({
  params,
}: {
  params: { workerId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { workerId } = params
  const worker = await fetchWorker(workerId)
  const assignments = worker ? await fetchWorkerAssignments(worker.id) : []

  if (!worker) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <div className="space-y-6">
        <PageHeader
          title={worker.name}
          description="Perfil do profissional"
          actions={
            <Button asChild variant="outline">
              <Link href={routes.workforceEdit(worker.id)}>Editar</Link>
            </Button>
          }
        />

        <PageSection title="Contato">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">Telefone</div>
              <div className="text-sm font-medium">{worker.phone ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Email</div>
              <div className="text-sm font-medium">{worker.email ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Tipo</div>
              <div className="text-sm font-medium">{worker.workerType}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="text-sm font-medium">{worker.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Habilidades</div>
              <div className="text-sm font-medium">
                {worker.skills.length ? worker.skills.join(", ") : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Atualizado</div>
              <div className="text-sm font-medium">
                {formatDate(worker.updatedAt, locale)}
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection title="Resumo">
          <WorkerSummary
            activeJobs={assignments.filter((assignment) => assignment.status !== "completed").length}
            completedJobs={assignments.filter((assignment) => assignment.status === "completed").length}
          />
        </PageSection>

        <PageSection title="Atribuições">
          <DataTableClient
            columns={[
              {
                id: "role",
                header: "Papel",
                cell: (row) => <span className="font-medium">{row.role.name}</span>,
                accessor: (row) => row.role.name,
                sortable: true,
              },
              {
                id: "status",
                header: "Status",
                cell: (row) => (
                  <Badge variant={row.status === "completed" ? "secondary" : "outline"}>
                    {row.status}
                  </Badge>
                ),
                accessor: (row) => row.status,
                sortable: true,
              },
              {
                id: "created",
                header: "Criado em",
                cell: (row) => formatDate(row.createdAt, locale),
                accessor: (row) => row.createdAt,
                sortable: true,
              },
            ]}
            data={assignments}
            rowKey={(row) => row.id}
          />
        </PageSection>
      </div>
    </RequireRole>
  )
}
