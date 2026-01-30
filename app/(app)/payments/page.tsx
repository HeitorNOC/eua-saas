import Link from "next/link"
import { PlusIcon, WalletCardsIcon } from "lucide-react"

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

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Reembolsado",
}

export default async function PaymentsPage({
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

  const columns = [
    {
      id: "job",
      header: "Job",
      cell: (row: Payment) => (
        <div className="font-medium">
          {jobMap.get(row.jobId ?? "") ?? "Job desconhecido"}
        </div>
      ),
      accessor: (row: Payment) => jobMap.get(row.jobId ?? "") ?? "",
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: Payment) => {
        const status = row.status ?? "pending"
        return (
          <StatusBadge status={status as "pending" | "paid" | "failed"}>
            {statusLabels[status] ?? status}
          </StatusBadge>
        )
      },
      accessor: (row: Payment) => row.status,
      sortable: true,
    },
    {
      id: "amount",
      header: "Valor",
      cell: (row: Payment) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.amount, locale, row.currency)}
        </span>
      ),
      accessor: (row: Payment) => row.amount,
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Data",
      cell: (row: Payment) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.createdAt, locale)}
        </span>
      ),
      accessor: (row: Payment) => row.createdAt,
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (row: Payment) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.paymentDetail(row.id)}>Ver detalhes</Link>
        </Button>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ]

  return (
    <RequireRole roles={["owner", "admin", "finance"]}>
      <PageContainer>
        <PageHeader
          title={t("nav.payments")}
          description="Controle de faturamento e recebiveis."
          actions={
            <Button asChild>
              <Link href={routes.paymentNew()}>
                <PlusIcon className="mr-2 size-4" />
                Novo pagamento
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
                  href={`${routes.payments}?page=${page}&pageSize=${pageSize}`}
                >
                  Tentar novamente
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <PageSection>
          <PaymentSummary
            locale={locale}
            total={summary.totalProcessed}
            pending={summary.totalPending}
            paid={summary.totalSucceeded}
            failed={summary.totalFailed}
          />
        </PageSection>

        <PageSection>
          <ListToolbar
            searchPlaceholder="Buscar pagamentos..."
            filters={
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="30d">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

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
                baseUrl={routes.payments}
                pageSize={pageSize}
              />
            </>
          ) : (
            <EmptyState
              title="Sem pagamentos recentes"
              description="Conecte o payments-service para acompanhar entradas e saidas."
              icon={<WalletCardsIcon className="size-6" />}
              action={
                <Button asChild>
                  <Link href={routes.paymentNew()}>Novo pagamento</Link>
                </Button>
              }
            />
          )}
        </PageSection>
      </PageContainer>
    </RequireRole>
  )
}
