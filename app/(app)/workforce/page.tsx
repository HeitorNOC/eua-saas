import Link from "next/link"
import { PlusIcon, WrenchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTableClient } from "@/components/page/data-table-client"
import { EmptyState } from "@/components/page/empty-state"
import { ListToolbar } from "@/components/page/list-toolbar"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { Pagination } from "@/components/page/pagination"
import { StatusBadge } from "@/components/ui/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { fetchWorkers, fetchWorkersCount } from "@/features/workforce/queries"
import type { Worker } from "@/features/workforce/schemas"
import { RequireRole } from "@/components/auth/require-role"
import { ApiError } from "@/lib/api/error"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  on_leave: "Afastado",
}

const typeLabels: Record<string, string> = {
  employee: "Funcionario",
  contractor: "Terceirizado",
  freelancer: "Freelancer",
}

export default async function WorkforcePage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>
}) {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const params = await searchParams
  const page = Math.max(1, Number(params?.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Number(params?.pageSize ?? 10)))
  const offset = (page - 1) * pageSize

  let data: Worker[] = []
  let total = 0
  let error: string | null = null

  try {
    ;[data, total] = await Promise.all([
      fetchWorkers(pageSize, offset),
      fetchWorkersCount(),
    ])
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const columns = [
    {
      id: "worker",
      header: "Profissional",
      cell: (row: Worker) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <span className="text-xs font-medium">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-muted-foreground text-xs">
              {typeLabels[row.workerType] ?? row.workerType}
            </div>
          </div>
        </div>
      ),
      accessor: (row: Worker) => row.name,
      sortable: true,
    },
    {
      id: "workerType",
      header: "Tipo",
      cell: (row: Worker) => (
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {typeLabels[row.workerType] ?? row.workerType}
        </span>
      ),
      accessor: (row: Worker) => row.workerType,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: Worker) => {
        const status = row.status ?? "active"
        return (
          <StatusBadge status={status as "active" | "inactive"}>
            {statusLabels[status] ?? status}
          </StatusBadge>
        )
      },
      accessor: (row: Worker) => row.status,
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (row: Worker) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.workforceDetail(row.id)}>Ver detalhes</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <PageContainer>
        <PageHeader
          title={t("nav.workforce")}
          description="Gestao de equipes, habilidades e disponibilidade."
          actions={
            <Button asChild>
              <Link href={routes.workforceNew()}>
                <PlusIcon className="mr-2 size-4" />
                Adicionar profissional
              </Link>
            </Button>
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>
              {error}
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link
                  href={`${routes.workforce}?page=${page}&pageSize=${pageSize}`}
                >
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <PageSection>
          <ListToolbar searchPlaceholder="Buscar profissionais por nome..." />

          {data.length > 0 ? (
            <>
              <DataTableClient
                columns={columns}
                data={data}
                rowKey={(row) => row.id}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                baseUrl={routes.workforce}
                pageSize={pageSize}
              />
            </>
          ) : (
            <EmptyState
              title="Nenhum profissional cadastrado"
              description="Cadastre profissionais e defina capacidades por servico."
              icon={<WrenchIcon className="size-6" />}
              action={
                <Button asChild>
                  <Link href={routes.workforceNew()}>Adicionar profissional</Link>
                </Button>
              }
            />
          )}
        </PageSection>
      </PageContainer>
    </RequireRole>
  )
}
