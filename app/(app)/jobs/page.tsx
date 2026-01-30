import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableClient } from "@/components/page/data-table-client"
import { ListToolbar } from "@/components/page/list-toolbar"
import { EmptyState } from "@/components/page/empty-state"
import { PageHeader, PageSection } from "@/components/page/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { fetchJobs, fetchJobsCount } from "@/features/jobs/queries"
import { CreateJobForm } from "@/features/jobs/create-job-form"
import type { Job } from "@/features/jobs/schemas"
import { formatDate } from "@/lib/formatters"
import { RequireRole } from "@/components/auth/require-role"
import { ApiError } from "@/lib/api/error"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function JobsPage(props: {
  searchParams?: { page?: string; pageSize?: string }
}) {
  // searchParams pode ser Promise em server components
  const rawParams = props.searchParams && typeof (props.searchParams as any).then === "function"
    ? await props.searchParams
    : props.searchParams
  const page = Math.max(1, Number(rawParams?.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Number(rawParams?.pageSize ?? 10)))
  const offset = (page - 1) * pageSize

  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  let jobs: Job[] = []
  let total = 0
  let error: string | null = null

  try {
    ;[jobs, total] = await Promise.all([
      fetchJobs(pageSize, offset),
      fetchJobsCount(),
    ])
  } catch (err) {
    error = "Erro interno do sistema. Tente novamente mais tarde."
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prevPage = Math.max(1, page - 1)
  const nextPage = Math.min(totalPages, page + 1)
  const columns = [
    {
      id: "job",
      header: "Job",
      cell: (row: Job) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-muted-foreground text-xs">{row.clientId}</div>
        </div>
      ),
      accessor: (row: Job) => row.title,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: Job) => (
        <Badge variant={row.status === "completed" ? "secondary" : "outline"}>
          {row.status ?? "-"}
        </Badge>
      ),
      accessor: (row: Job) => row.status ?? "",
      sortable: true,
    },
    {
      id: "created",
      header: "Criado em",
      cell: (row: Job) =>
        row.createdAt ? formatDate(row.createdAt, locale) : "-",
      accessor: (row: Job) => row.createdAt ?? "",
      sortable: true,
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row: Job) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.jobDetail(row.id)}>Ver</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={`${routes.jobs}?page=${page}&pageSize=${pageSize}`}>
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <PageHeader
          title={t("jobs.title")}
          description={t("jobs.subtitle")}
          actions={
            <Button asChild>
              <Link href={routes.jobNew()}>{t("jobs.create")}</Link>
            </Button>
          }
        />
        <ListToolbar searchPlaceholder="Buscar jobs" />
        {jobs.length ? (
          <DataTableClient columns={columns} data={jobs} rowKey={(row) => row.id} />
        ) : (
          <EmptyState
            title="Nenhum job encontrado"
            description="Crie o primeiro job para começar a operar."
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
                <Link href={`${routes.jobs}?page=${prevPage}&pageSize=${pageSize}`}>
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
                <Link href={`${routes.jobs}?page=${nextPage}&pageSize=${pageSize}`}>
                  Próxima
                </Link>
              </Button>
            )}
          </div>
        </div>

        <PageSection title="Criar job" description="Ação via Server Action">
          <div className="rounded-lg border bg-card p-4">
            <CreateJobForm />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
