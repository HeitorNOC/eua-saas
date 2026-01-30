import Link from "next/link"
import { ClipboardListIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTableClient } from "@/components/page/data-table-client"
import { ListToolbar } from "@/components/page/list-toolbar"
import { EmptyState } from "@/components/page/empty-state"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { Pagination } from "@/components/page/pagination"
import { StatusBadge } from "@/components/ui/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { fetchJobs, fetchJobsCount } from "@/features/jobs/queries"
import type { Job } from "@/features/jobs/schemas"
import { formatDate } from "@/lib/formatters"
import { RequireRole } from "@/components/auth/require-role"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluido",
  cancelled: "Cancelado",
}

export default async function JobsPage(props: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>
}) {
  const params = await props.searchParams
  const page = Math.max(1, Number(params?.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Number(params?.pageSize ?? 10)))
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
  } catch {
    error = "Erro interno do sistema. Tente novamente mais tarde."
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const columns = [
    {
      id: "job",
      header: "Job",
      cell: (row: Job) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ClipboardListIcon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{row.title}</div>
            <div className="text-muted-foreground text-xs">ID: {row.id.slice(0, 8)}</div>
          </div>
        </div>
      ),
      accessor: (row: Job) => row.title,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: Job) => {
        const status = row.status ?? "pending"
        return (
          <StatusBadge status={status as keyof typeof statusLabels}>
            {statusLabels[status] ?? status}
          </StatusBadge>
        )
      },
      accessor: (row: Job) => row.status ?? "",
      sortable: true,
    },
    {
      id: "created",
      header: "Criado em",
      cell: (row: Job) =>
        row.createdAt ? (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.createdAt, locale)}
          </span>
        ) : (
          "-"
        ),
      accessor: (row: Job) => row.createdAt ?? "",
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (row: Job) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.jobDetail(row.id)}>Ver detalhes</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <PageContainer>
        <PageHeader
          title={t("jobs.title")}
          description={t("jobs.subtitle")}
          actions={
            <Button asChild>
              <Link href={routes.jobNew()}>
                <PlusIcon className="mr-2 size-4" />
                {t("jobs.create")}
              </Link>
            </Button>
          }
        />

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

        <PageSection>
          <ListToolbar searchPlaceholder="Buscar jobs por titulo ou ID..." />

          {jobs.length > 0 ? (
            <>
              <DataTableClient
                columns={columns}
                data={jobs}
                rowKey={(row) => row.id}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                baseUrl={routes.jobs}
                pageSize={pageSize}
              />
            </>
          ) : (
            <EmptyState
              title="Nenhum job encontrado"
              description="Crie o primeiro job para comecar a operar."
              icon={<ClipboardListIcon className="size-6" />}
              action={
                <Button asChild>
                  <Link href={routes.jobNew()}>{t("jobs.create")}</Link>
                </Button>
              }
            />
          )}
        </PageSection>
      </PageContainer>
    </RequireRole>
  )
}
