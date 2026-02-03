"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardListIcon,
  UsersIcon,
  CalendarIcon,
  DollarSignIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { completeOnboardingTourAction } from "@/actions/onboarding"
import { routes } from "@/lib/routes"

const tourSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao FieldPro!",
    description:
      "Vamos fazer um tour rapido para voce conhecer as principais funcionalidades da plataforma.",
    icon: CheckIcon,
    action: null,
  },
  {
    id: "clients",
    title: "Gestao de Clientes",
    description:
      "Cadastre e gerencie seus clientes em um so lugar. Mantenha historico completo de servicos e preferencias.",
    icon: UsersIcon,
    action: { label: "Ver Clientes", href: routes.clients },
  },
  {
    id: "jobs",
    title: "Controle de Jobs",
    description:
      "Crie, acompanhe e gerencie todos os seus servicos. De orcamento ate conclusao, tudo centralizado.",
    icon: ClipboardListIcon,
    action: { label: "Ver Jobs", href: routes.jobs },
  },
  {
    id: "schedule",
    title: "Agenda e Calendario",
    description:
      "Visualize e organize sua agenda. Arraste e solte para reorganizar compromissos facilmente.",
    icon: CalendarIcon,
    action: { label: "Ver Agenda", href: routes.schedule },
  },
  {
    id: "payments",
    title: "Controle Financeiro",
    description:
      "Acompanhe pagamentos, gere relatorios e tenha visao completa do seu faturamento.",
    icon: DollarSignIcon,
    action: { label: "Ver Pagamentos", href: routes.payments },
  },
  {
    id: "settings",
    title: "Configuracoes",
    description:
      "Personalize sua experiencia, gerencie sua equipe e configure preferencias do sistema.",
    icon: SettingsIcon,
    action: { label: "Ver Configuracoes", href: routes.settings },
  },
]

export function OnboardingTour({ showTour = false }: { showTour?: boolean }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(showTour)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isPending, startTransition] = React.useTransition()

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const StepIcon = step.icon

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleComplete = () => {
    startTransition(async () => {
      await completeOnboardingTourAction()
      setIsOpen(false)
    })
  }

  const handleSkip = () => {
    startTransition(async () => {
      await completeOnboardingTourAction()
      setIsOpen(false)
    })
  }

  const handleAction = () => {
    if (step.action) {
      handleComplete()
      router.push(step.action.href)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <StepIcon className="size-6 text-primary" />
            </div>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
              disabled={isPending}
            >
              <XIcon className="size-5" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 py-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={isPending}
              >
                Anterior
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAction}
                disabled={isPending}
              >
                {step.action.label}
              </Button>
            )}
            <Button size="sm" onClick={handleNext} disabled={isPending}>
              {isPending ? (
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isLastStep ? (
                <>
                  Comecar
                  <CheckIcon className="ml-2 size-4" />
                </>
              ) : (
                <>
                  Proximo
                  <ArrowRightIcon className="ml-2 size-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          Etapa {currentStep + 1} de {tourSteps.length}
        </p>
      </DialogContent>
    </Dialog>
  )
}
