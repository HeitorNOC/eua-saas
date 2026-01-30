import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DataTableClient } from "@/components/page/data-table-client"
import { EmptyState } from "@/components/page/empty-state"
import { ListToolbar } from "@/components/page/list-toolbar"
import { PageHeader } from "@/components/page/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { fetchWorkers, fetchWorkersCount } from "@/features/workforce/queries"
import type { Worker } from "@/features/workforce/schemas"
import { RequireRole } from "@/components/auth/require-role"
import { ApiError } from "@/lib/api/error"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function WorkforcePage({
  searchParams,
}: {
  searchParams?: { page?: string; pageSize?: string }
}) {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const page = Math.max(1, Number(searchParams?.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Number(searchParams?.pageSize ?? 10)))
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
  const prevPage = Math.max(1, page - 1)
  const nextPage = Math.min(totalPages, page + 1)
  const columns = [
    {
      id: "worker",
      header: "Profissional",
      cell: (row: (typeof data)[number]) => row.name,
      accessor: (row: (typeof data)[number]) => row.name,
      sortable: true,
    },
    {
      id: "workerType",
      header: "Tipo",
      cell: (row: (typeof data)[number]) => row.workerType,
      accessor: (row: (typeof data)[number]) => row.workerType,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: (typeof data)[number]) => row.status,
      accessor: (row: (typeof data)[number]) => row.status,
      sortable: true,
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row: (typeof data)[number]) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.workforceDetail(row.id)}>Ver</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.workforce")}
          description="Gestão de equipes, habilidades e disponibilidade."
          actions={
            <Button asChild>
              <Link href={routes.workforceNew()}>Adicionar worker</Link>
            </Button>
          }
        />
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>
              {error}
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={`${routes.workforce}?page=${page}&pageSize=${pageSize}`}>
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        <ListToolbar searchPlaceholder="Buscar equipe" />
        {data.length ? (
          <DataTableClient columns={columns} data={data} rowKey={(row) => row.id} />
        ) : (
          <EmptyState
            title="Nenhuma equipe registrada"
            description="Cadastre profissionais e defina capacidades por serviço."
            action={<Button variant="secondary">Adicionar worker</Button>}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-muted-foreground text-sm">
            Página {page} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {page <= 1 ? (
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href={`${routes.workforce}?page=${prevPage}&pageSize=${pageSize}`}>
                  Anterior
                </Link>
              </Button>
            )}
            {page >= totalPages ? (
              <Button variant="outline" size="sm" disabled>
                Próxima
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href={`${routes.workforce}?page=${nextPage}&pageSize=${pageSize}`}>
                  Próxima
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  )
}
