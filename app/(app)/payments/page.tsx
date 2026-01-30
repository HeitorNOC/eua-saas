import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DataTableClient } from "@/components/page/data-table-client"
import { EmptyState } from "@/components/page/empty-state"
import { ListToolbar } from "@/components/page/list-toolbar"
import { PageHeader } from "@/components/page/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createTranslator } from "@/lib/i18n/translator"
import { RequireRole } from "@/components/auth/require-role"
import {
  fetchPayments,
  fetchPaymentsSummary,
  fetchPaymentsCount,
} from "@/features/payments/queries"
import { fetchJobs } from "@/features/jobs/queries"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { PaymentSummary } from "@/components/payments/payment-summary"
import { ApiError } from "@/lib/api/error"
import type { Payment } from "@/features/payments/schemas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: { page?: string; pageSize?: string }
}) {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const page = Math.max(1, Number(searchParams?.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Number(searchParams?.pageSize ?? 10)))
  const offset = (page - 1) * pageSize

  let data: Payment[] = []
  let summary = {
    totalProcessed: 0,
    totalSucceeded: 0,
    totalPending: 0,
    totalFailed: 0,
  }
  let total = 0
  let jobMap = new Map<string, string>()
  let error: string | null = null

  try {
    const [payments, paymentsSummary, paymentsCount, jobs] = await Promise.all([
      fetchPayments(pageSize, offset),
      fetchPaymentsSummary(),
      fetchPaymentsCount(),
      fetchJobs(),
    ])
    data = payments
    summary = paymentsSummary
    total = paymentsCount
    jobMap = new Map(jobs.map((job) => [job.id, job.title]))
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
      id: "job",
      header: "Job",
      cell: (row: (typeof data)[number]) => jobMap.get(row.jobId ?? "") ?? "Job",
      accessor: (row: (typeof data)[number]) => jobMap.get(row.jobId ?? "") ?? "Job",
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
      id: "amount",
      header: "Valor",
      cell: (row: (typeof data)[number]) =>
        formatCurrency(row.amount, locale, row.currency),
      accessor: (row: (typeof data)[number]) => row.amount,
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Criado em",
      cell: (row: (typeof data)[number]) =>
        formatDate(row.createdAt, locale),
      accessor: (row: (typeof data)[number]) => row.createdAt,
      sortable: true,
    },
    {
      id: "actions",
      header: "Ações",
      cell: (row: (typeof data)[number]) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.paymentDetail(row.id)}>Ver</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "finance"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.payments")}
          description="Controle de faturamento e recebíveis."
          actions={
            <Button asChild>
              <Link href={routes.paymentNew()}>Novo pagamento</Link>
            </Button>
          }
        />
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>
              {error}
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={`${routes.payments}?page=${page}&pageSize=${pageSize}`}>
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        <PaymentSummary
          locale={locale}
          total={summary.totalProcessed}
          pending={summary.totalPending}
          paid={summary.totalSucceeded}
          failed={summary.totalFailed}
        />
        <ListToolbar
          searchPlaceholder="Buscar pagamentos"
          filters={
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />
        {data.length ? (
          <DataTableClient columns={columns} data={data} rowKey={(row) => row.id} />
        ) : (
          <EmptyState
            title="Sem pagamentos recentes"
            description="Conecte o payments-service para acompanhar entradas e saídas."
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
                <Link href={`${routes.payments}?page=${prevPage}&pageSize=${pageSize}`}>
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
                <Link href={`${routes.payments}?page=${nextPage}&pageSize=${pageSize}`}>
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
