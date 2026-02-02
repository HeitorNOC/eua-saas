"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckIcon, ArrowRightIcon, ShieldCheckIcon, ZapIcon, HeadphonesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"

const planFeatures = [
  "Jobs e clientes ilimitados",
  "Orcamentos e estimates ilimitados",
  "Agendamento e calendario",
  "Gestao de equipe",
  "Relatorios completos",
  "Integracoes com bancos",
  "Suporte prioritario",
]

const highlights = [
  {
    icon: ShieldCheckIcon,
    title: "Seguro",
    description: "Dados criptografados e backups diarios",
  },
  {
    icon: ZapIcon,
    title: "Rapido",
    description: "Interface otimizada para produtividade",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte",
    description: "Atendimento em portugues, ingles e espanhol",
  },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    
    // Simula processamento de pagamento
    // Em producao, isso integraria com Stripe ou outro gateway
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Salva estado temporario
    localStorage.setItem("onboarding_subscription", "active")
    
    router.push(routes.onboardingSetup)
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 bg-foreground transition-all" />
        </div>
        <span className="text-sm text-muted-foreground">Etapa 2 de 3</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Assine para comecar
        </h1>
        <p className="text-muted-foreground">
          Acesso completo a todas as funcionalidades por um preco unico.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-xl border-2 border-foreground bg-card p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-lg font-semibold">Plano Profissional</h3>
            <p className="text-sm text-muted-foreground">Tudo que voce precisa</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$49</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <p className="text-xs text-muted-foreground">Cobrado mensalmente</p>
          </div>
        </div>

        <div className="my-6 h-px bg-border" />

        <ul className="space-y-3">
          {planFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <div className="flex size-5 items-center justify-center rounded-full bg-foreground/10">
                <CheckIcon className="size-3 text-foreground" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex size-8 items-center justify-center rounded-md bg-background">
                <Icon className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Subscribe Button */}
      <Button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processando...
          </>
        ) : (
          <>
            Assinar agora
            <ArrowRightIcon className="ml-2 size-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Ao assinar, voce concorda com nossos Termos de Servico e Politica de Privacidade.
        Cancelamento a qualquer momento.
      </p>
    </div>
  )
}
