import Link from "next/link"
import { PlusIcon, FileTextIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { EmptyState } from "@/components/page/empty-state"
import { StatusBadge } from "@/components/ui/status-badge"
import { routes } from "@/lib/routes"

// Mock data - em producao viria do backend
const estimates = [
  {
    id: "1",
    clientName: "Maria Silva",
    description: "Reforma completa da cozinha",
    status: "draft" as const,
    total: 4500,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    clientName: "Joao Santos",
    description: "Limpeza mensal residencial",
    status: "sent" as const,
    total: 250,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    clientName: "Empresa ABC",
    description: "Pintura externa do escritorio",
    status: "approved" as const,
    total: 3200,
    createdAt: "2024-01-10",
  },
]

const statusMap = {
  draft: "pending" as const,
  sent: "active" as const,
  approved: "success" as const,
  rejected: "inactive" as const,
  expired: "inactive" as const,
}

const statusLabels = {
  draft: "Rascunho",
  sent: "Enviado",
  approved: "Aprovado",
  rejected: "Rejeitado",
  expired: "Expirado",
}

export default function EstimatesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Orcamentos"
        description="Gerencie seus orcamentos e propostas"
        actions={
          <Button asChild>
            <Link href={routes.estimateNew()}>
              <PlusIcon className="mr-2 size-4" />
              Novo Orcamento
            </Link>
          </Button>
        }
      />

      <PageSection>
        {estimates.length === 0 ? (
          <EmptyState
            icon={<FileTextIcon className="size-12" />}
            title="Nenhum orcamento"
            description="Crie seu primeiro orcamento para comecar."
            action={
              <Button asChild>
                <Link href={routes.estimateNew()}>
                  <PlusIcon className="mr-2 size-4" />
                  Criar Orcamento
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border bg-card">
            <div className="divide-y">
              {estimates.map((estimate) => (
                <Link
                  key={estimate.id}
                  href={routes.estimateDetail(estimate.id)}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <FileTextIcon className="size-5" />
                    </div>
                    <div>
                      <div className="font-medium">{estimate.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {estimate.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-semibold">
                        ${estimate.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {estimate.createdAt}
                      </div>
                    </div>
                    <StatusBadge
                      status={statusMap[estimate.status]}
                      label={statusLabels[estimate.status]}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageSection>
    </PageContainer>
  )
}
