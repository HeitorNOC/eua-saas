import Link from "next/link"
import {
  PlusIcon,
  CalendarPlusIcon,
  UserPlusIcon,
  FileTextIcon,
  CreditCardIcon,
  UsersIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { routes } from "@/lib/routes"

type QuickAction = {
  label: string
  href: string
  icon: React.ElementType
  color: string
  description: string
}

const actions: QuickAction[] = [
  {
    label: "Novo Job",
    href: routes.newJob,
    icon: FileTextIcon,
    color: "bg-blue-500",
    description: "Criar ordem de servico",
  },
  {
    label: "Agendar",
    href: routes.schedule,
    icon: CalendarPlusIcon,
    color: "bg-orange-500",
    description: "Novo agendamento",
  },
  {
    label: "Novo Cliente",
    href: routes.newClient,
    icon: UserPlusIcon,
    color: "bg-violet-500",
    description: "Cadastrar cliente",
  },
  {
    label: "Pagamento",
    href: routes.newPayment,
    icon: CreditCardIcon,
    color: "bg-emerald-500",
    description: "Registrar pagamento",
  },
  {
    label: "Equipe",
    href: routes.newWorker,
    icon: UsersIcon,
    color: "bg-pink-500",
    description: "Adicionar membro",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:border-foreground/20 hover:shadow-md"
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110",
              action.color
            )}
          >
            <action.icon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
