"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircle2Icon,
  CircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RocketIcon,
  UsersIcon,
  ClipboardListIcon,
  CalendarIcon,
  DollarSignIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { routes } from "@/lib/routes"

type ChecklistItem = {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
}

type Props = {
  clientsCount: number
  jobsCount: number
  eventsCount: number
  paymentsCount: number
}

export function OnboardingChecklist({
  clientsCount,
  jobsCount,
  eventsCount,
  paymentsCount,
}: Props) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const checklistItems: ChecklistItem[] = [
    {
      id: "client",
      title: "Cadastre seu primeiro cliente",
      description: "Adicione informacoes de contato e endereco",
      href: routes.clientNew(),
      icon: UsersIcon,
      completed: clientsCount > 0,
    },
    {
      id: "job",
      title: "Crie seu primeiro job",
      description: "Registre um servico para acompanhar",
      href: routes.jobNew(),
      icon: ClipboardListIcon,
      completed: jobsCount > 0,
    },
    {
      id: "schedule",
      title: "Agende um compromisso",
      description: "Organize sua agenda de servicos",
      href: routes.schedule,
      icon: CalendarIcon,
      completed: eventsCount > 0,
    },
    {
      id: "payment",
      title: "Registre um pagamento",
      description: "Controle suas entradas financeiras",
      href: routes.paymentNew(),
      icon: DollarSignIcon,
      completed: paymentsCount > 0,
    },
  ]

  const completedCount = checklistItems.filter((item) => item.completed).length
  const progress = (completedCount / checklistItems.length) * 100
  const allCompleted = completedCount === checklistItems.length

  // Don't show if all items are completed
  if (allCompleted) return null

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <RocketIcon className="size-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold">Primeiros passos</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} de {checklistItems.length} concluidos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="w-24" />
          {isExpanded ? (
            <ChevronUpIcon className="size-5 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="size-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="border-t px-4 pb-4">
          <ul className="divide-y">
            {checklistItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id} className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.completed ? (
                        <CheckCircle2Icon className="size-5 text-green-500" />
                      ) : (
                        <CircleIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <span
                          className={`text-sm font-medium ${
                            item.completed ? "text-muted-foreground line-through" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {!item.completed && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.href}>Fazer</Link>
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
