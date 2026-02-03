"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { CheckIcon, ArrowRightIcon, ShieldCheckIcon, ZapIcon, HeadphonesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"
import { processSubscriptionAction } from "@/actions/onboarding"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Para pequenas empresas",
    features: [
      "Ate 50 jobs/mes",
      "3 usuarios",
      "Agendamento basico",
      "Suporte por email",
    ],
  },
  {
    id: "professional",
    name: "Profissional",
    price: 49,
    description: "Tudo que voce precisa",
    popular: true,
    features: [
      "Jobs ilimitados",
      "10 usuarios",
      "Agendamento avancado",
      "Relatorios completos",
      "Integracoes",
      "Suporte prioritario",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "Para grandes operacoes",
    features: [
      "Tudo do Profissional",
      "Usuarios ilimitados",
      "API acesso",
      "SSO",
      "Gerente dedicado",
      "SLA garantido",
    ],
  },
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
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = () => {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("planId", selectedPlan)
      
      const result = await processSubscriptionAction({ success: false, error: null }, formData)
      
      if (result.success) {
        // TODO: In production, redirect to Stripe checkout
        // For now, proceed to setup
        router.push(routes.onboardingSetup)
      } else {
        setError(result.error)
      }
    })
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
          Escolha seu plano
        </h1>
        <p className="text-muted-foreground">
          Selecione o plano ideal para seu negocio. Cancele quando quiser.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Plans */}
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              disabled={isPending}
              className={`relative flex flex-col rounded-xl border-2 p-6 text-left transition-all disabled:opacity-50 ${
                isSelected
                  ? "border-foreground bg-accent"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                  Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              
              <ul className="flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="flex size-4 items-center justify-center rounded-full bg-foreground/10">
                      <CheckIcon className="size-2.5 text-foreground" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {isSelected && (
                <div className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                  <CheckIcon className="size-4" />
                </div>
              )}
            </button>
          )
        })}
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
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processando...
          </>
        ) : (
          <>
            Continuar com {plans.find(p => p.id === selectedPlan)?.name}
            <ArrowRightIcon className="ml-2 size-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Ao continuar, voce concorda com nossos Termos de Servico e Politica de Privacidade.
        7 dias de teste gratis. Cancelamento a qualquer momento.
      </p>
    </div>
  )
}
