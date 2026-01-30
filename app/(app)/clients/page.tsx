import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon, PlusIcon, UsersIcon } from "lucide-react"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { fetchClients, fetchClientsCount } from "@/features/clients/queries"
import { RequireRole } from "@/components/auth/require-role"
import type { Client } from "@/features/clients/schemas"
import { ApiError } from "@/lib/api/error"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function ClientsPage({
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

  let data: Client[] = []
  let total = 0
  let error: string | null = null

  try {
    ;[data, total] = await Promise.all([
      fetchClients(pageSize, offset),
      fetchClientsCount(),
    ])
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const columns = [
    {
      id: "client",
      header: "Cliente",
      cell: (row: Client) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <span className="text-xs font-medium">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            {row.email && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MailIcon className="size-3" />
                {row.email}
              </div>
            )}
          </div>
        </div>
      ),
      accessor: (row: Client) => row.name,
      sortable: true,
    },
    {
      id: "phone",
      header: "Telefone",
      cell: (row: Client) =>
        row.phone ? (
          <span className="flex items-center gap-1.5 text-sm">
            <PhoneIcon className="text-muted-foreground size-3.5" />
            {row.phone}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      accessor: (row: Client) => row.phone ?? "",
      sortable: true,
    },
    {
      id: "address",
      header: "Endereco",
      cell: (row: Client) =>
        row.address ? (
          <span className="flex items-center gap-1.5 text-sm">
            <MapPinIcon className="text-muted-foreground size-3.5 shrink-0" />
            <span className="truncate max-w-[200px]">{row.address}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      accessor: (row: Client) => row.address ?? "",
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (row: Client) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.clientDetail(row.id)}>Ver detalhes</Link>
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
          title={t("nav.clients")}
          description="Base centralizada de clientes e contatos."
          actions={
            <Button asChild>
              <Link href={routes.clientNew()}>
                <PlusIcon className="mr-2 size-4" />
                Adicionar cliente
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
                  href={`${routes.clients}?page=${page}&pageSize=${pageSize}`}
                >
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <PageSection>
          <ListToolbar searchPlaceholder="Buscar clientes por nome, email ou telefone..." />

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
                baseUrl={routes.clients}
                pageSize={pageSize}
              />
            </>
          ) : (
            <EmptyState
              title="Nenhum cliente cadastrado"
              description="Conecte seus clientes para iniciar jobs e contratos."
              icon={<UsersIcon className="size-6" />}
              action={
                <Button asChild>
                  <Link href={routes.clientNew()}>Adicionar cliente</Link>
                </Button>
              }
            />
          )}
        </PageSection>
      </PageContainer>
    </RequireRole>
  )
}
