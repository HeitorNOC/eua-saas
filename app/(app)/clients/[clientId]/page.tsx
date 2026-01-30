import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { fetchClient } from "@/features/clients/queries"
import { RequireRole } from "@/components/auth/require-role"
import { ClientSummary } from "@/components/clients/client-summary"
import { fetchJobs } from "@/features/jobs/queries"
import { fetchPayments } from "@/features/payments/queries"
import { DataTableClient } from "@/components/page/data-table-client"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function ClientDetailsPage({
  params,
}: {
  params: { clientId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { clientId } = params
  const client = await fetchClient(clientId)
  const jobs = client ? (await fetchJobs()).filter((job) => job.clientId === client.id) : []
  const jobIds = new Set(jobs.map((job) => job.id))
  const payments = client
    ? (await fetchPayments()).filter((payment) => payment.jobId && jobIds.has(payment.jobId))
    : []
  const totalRevenue = payments.reduce((total, payment) => total + payment.amount, 0)

  if (!client) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={client.name}
          description="Perfil completo do cliente"
          actions={
            <Button asChild variant="outline">
              <Link href={routes.clientEdit(client.id)}>Editar</Link>
            </Button>
          }
        />

        <PageSection title="Contato">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">Email</div>
              <div className="text-sm font-medium">{client.email}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Telefone</div>
              <div className="text-sm font-medium">{client.phone}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Endereço</div>
              <div className="text-sm font-medium">{client.address}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Atualizado</div>
              <div className="text-sm font-medium">
                {client.updatedAt ? formatDate(client.updatedAt, locale) : "-"}
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection title="Resumo">
          <ClientSummary
            locale={locale}
            activeJobs={jobs.filter((job) => job.status !== "completed").length}
            totalRevenue={totalRevenue}
          />
        </PageSection>

        <PageSection title="Jobs">
          <DataTableClient
            columns={[
              {
                id: "job",
                header: "Job",
                cell: (row) => <span className="font-medium">{row.title}</span>,
                accessor: (row) => row.title,
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
                cell: (row) =>
                  row.createdAt ? formatDate(row.createdAt, locale) : "-",
                accessor: (row) => row.createdAt ?? "",
                sortable: true,
              },
            ]}
            data={jobs}
            rowKey={(row) => row.id}
          />
        </PageSection>

        <PageSection title="Pagamentos">
          <DataTableClient
            columns={[
              {
                id: "status",
                header: "Status",
                cell: (row) => row.status,
                accessor: (row) => row.status,
                sortable: true,
              },
              {
                id: "amount",
                header: "Valor",
                cell: (row) => formatCurrency(row.amount, locale, row.currency),
                accessor: (row) => row.amount,
                sortable: true,
              },
              {
                id: "createdAt",
                header: "Criado em",
                cell: (row) => formatDate(row.createdAt, locale),
                accessor: (row) => row.createdAt,
                sortable: true,
              },
            ]}
            data={payments}
            rowKey={(row) => row.id}
          />
        </PageSection>
      </div>
    </RequireRole>
  )
}
