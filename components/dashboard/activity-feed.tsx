"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CheckCircle2Icon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon,
  UserPlusIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type ActivityItem = {
  id: string
  type: "job_created" | "job_completed" | "payment_received" | "client_added" | "schedule_updated" | "alert"
  title: string
  description?: string
  timestamp: Date
  metadata?: Record<string, string>
}

const typeConfig = {
  job_created: {
    icon: FileTextIcon,
    color: "text-blue-600 bg-blue-100",
  },
  job_completed: {
    icon: CheckCircle2Icon,
    color: "text-green-600 bg-green-100",
  },
  payment_received: {
    icon: DollarSignIcon,
    color: "text-emerald-600 bg-emerald-100",
  },
  client_added: {
    icon: UserPlusIcon,
    color: "text-violet-600 bg-violet-100",
  },
  schedule_updated: {
    icon: CalendarIcon,
    color: "text-orange-600 bg-orange-100",
  },
  alert: {
    icon: AlertCircleIcon,
    color: "text-red-600 bg-red-100",
  },
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ClockIcon className="size-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhuma atividade recente
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const config = typeConfig[activity.type]
        const Icon = config.icon

        return (
          <div
            key={activity.id}
            className={cn(
              "group flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50",
              index === 0 && "bg-muted/30"
            )}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                config.color
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1 space-y-0.5 overflow-hidden">
              <p className="text-sm font-medium leading-tight">
                {activity.title}
              </p>
              {activity.description && (
                <p className="truncate text-xs text-muted-foreground">
                  {activity.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground/70">
                {formatDistanceToNow(activity.timestamp, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
