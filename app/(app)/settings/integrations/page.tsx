"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CircleIcon,
  ExternalLinkIcon,
  PlugIcon,
  RefreshCwIcon,
  BuildingIcon,
  HomeIcon,
  LandmarkIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { routes } from "@/lib/routes"
import type { Integration, IntegrationStatus } from "@/features/integrations/types"

// Mock integrations data
const integrations: Integration[] = [
  {
    id: "1",
    type: "home_depot",
    name: "Home Depot",
    description: "Importar materiais e precos automaticamente para seus orcamentos.",
    status: "disconnected",
  },
  {
    id: "2",
    type: "bank",
    name: "Stripe",
    description: "Processar pagamentos de clientes e gerenciar recebimentos.",
    status: "connected",
    connectedAt: "2024-01-10T10:00:00Z",
    lastSync: "2024-01-20T15:30:00Z",
  },
  {
    id: "3",
    type: "bank",
    name: "Mercury",
    description: "Conectar sua conta bancaria para sincronizar transacoes.",
    status: "pending",
  },
  {
    id: "4",
    type: "real_estate",
    name: "Zillow",
    description: "Obter dados de imoveis automaticamente (metragem, valor estimado).",
    status: "disconnected",
  },
]

const statusConfig: Record<IntegrationStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  connected: { label: "Conectado", variant: "default" },
  disconnected: { label: "Desconectado", variant: "outline" },
  pending: { label: "Pendente", variant: "secondary" },
  error: { label: "Erro", variant: "destructive" },
}

const iconMap = {
  home_depot: HomeIcon,
  bank: LandmarkIcon,
  real_estate: BuildingIcon,
}

export default function IntegrationsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleConnect = async (integration: Integration) => {
    setLoading(integration.id)
    
    // Simula conexao
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success(`${integration.name} conectado com sucesso!`)
    setLoading(null)
  }

  const handleDisconnect = async (integration: Integration) => {
    setLoading(integration.id)
    
    // Simula desconexao
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success(`${integration.name} desconectado.`)
    setLoading(null)
  }

  const handleSync = async (integration: Integration) => {
    setLoading(integration.id)
    
    // Simula sincronizacao
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`${integration.name} sincronizado!`)
    setLoading(null)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Integracoes"
        description="Conecte servicos externos para automatizar seu fluxo de trabalho"
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.settings}>
              <ArrowLeftIcon className="mr-2 size-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <PageSection>
        <div className="space-y-4">
          {integrations.map((integration) => {
            const Icon = iconMap[integration.type]
            const status = statusConfig[integration.status]
            const isLoading = loading === integration.id

            return (
              <div
                key={integration.id}
                className="flex items-center justify-between rounded-xl border bg-card p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                    {integration.lastSync && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ultima sincronizacao: {new Date(integration.lastSync).toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {integration.status === "connected" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCwIcon className="size-4 animate-spin" />
                        ) : (
                          <RefreshCwIcon className="mr-2 size-4" />
                        )}
                        {!isLoading && "Sincronizar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(integration)}
                        disabled={isLoading}
                      >
                        Desconectar
                      </Button>
                    </>
                  )}
                  {integration.status === "disconnected" && (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCwIcon className="size-4 animate-spin" />
                      ) : (
                        <>
                          <PlugIcon className="mr-2 size-4" />
                          Conectar
                        </>
                      )}
                    </Button>
                  )}
                  {integration.status === "pending" && (
                    <Button variant="outline" size="sm" disabled>
                      Aguardando...
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </PageSection>

      {/* Coming Soon */}
      <PageSection title="Em Breve">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Plaid", description: "Agregador bancario para multiplas contas" },
            { name: "QuickBooks", description: "Integracao contabil automatica" },
            { name: "Slack", description: "Notificacoes e alertas em tempo real" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center rounded-xl border border-dashed bg-muted/30 p-6 text-center"
            >
              <CircleIcon className="mb-3 size-8 text-muted-foreground/50" />
              <h4 className="font-medium">{item.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </PageContainer>
  )
}
