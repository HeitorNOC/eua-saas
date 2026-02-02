"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { SparklesIcon, HardHatIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"

type BusinessType = "cleaning" | "construction"

const businessTypes = [
  {
    id: "cleaning" as const,
    title: "Limpeza",
    description: "Servicos de limpeza residencial e comercial",
    icon: SparklesIcon,
    features: ["Agendamento recorrente", "Precificacao por area", "Checklist de tarefas"],
  },
  {
    id: "construction" as const,
    title: "Construcao / Reformas",
    description: "Projetos de construcao, reformas e manutencao",
    icon: HardHatIcon,
    features: ["Orcamentos detalhados", "Gestao de materiais", "Acompanhamento de obra"],
  },
]

export default function BusinessTypePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<BusinessType | null>(null)

  const handleContinue = () => {
    if (selected) {
      // Salva o tipo de negocio no localStorage temporariamente
      // Em producao, isso seria salvo no backend
      localStorage.setItem("onboarding_business_type", selected)
      router.push(routes.onboardingSubscription)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 bg-foreground transition-all" />
        </div>
        <span className="text-sm text-muted-foreground">Etapa 1 de 3</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Qual e o tipo do seu negocio?
        </h1>
        <p className="text-muted-foreground">
          Isso nos ajuda a personalizar sua experiencia e mostrar as ferramentas certas.
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        {businessTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selected === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelected(type.id)}
              className={`group relative flex flex-col items-start rounded-xl border-2 p-6 text-left transition-all ${
                isSelected
                  ? "border-foreground bg-accent"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className={`mb-4 flex size-12 items-center justify-center rounded-lg ${
                isSelected ? "bg-foreground text-background" : "bg-muted"
              }`}>
                <Icon className="size-6" />
              </div>

              <h3 className="font-semibold">{type.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {type.description}
              </p>

              <ul className="mt-4 space-y-1">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="size-1.5 rounded-full bg-muted-foreground/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full"
        size="lg"
      >
        Continuar
        <ArrowRightIcon className="ml-2 size-4" />
      </Button>
    </div>
  )
}
