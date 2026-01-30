import Link from "next/link"
import { format, isToday, isTomorrow, differenceInMinutes } from "date-fns"
import { ptBR, enUS, es } from "date-fns/locale"
import { ClockIcon, MapPinIcon, UserIcon } from "lucide-react"

import { StatusBadge } from "@/components/ui/status-badge"
import type { Locale } from "@/config/site"
import { routes } from "@/lib/routes"
import type { ScheduleEvent } from "@/features/scheduling/types"

const locales = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": es,
}

function getDateLabel(date: Date, locale: Locale): string {
  const dateLocale = locales[locale]
  if (isToday(date)) {
    return `Hoje, ${format(date, "HH:mm", { locale: dateLocale })}`
  }
  if (isTomorrow(date)) {
    return `Amanha, ${format(date, "HH:mm", { locale: dateLocale })}`
  }
  return format(date, "dd MMM, HH:mm", { locale: dateLocale })
}

function getDuration(start: Date, end: Date): string {
  const minutes = differenceInMinutes(end, start)
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}min`
}

export function UpcomingEvents({
  locale,
  events,
}: {
  locale: Locale
  events: ScheduleEvent[]
}) {
  const statusMap = {
    scheduled: "pending" as const,
    in_progress: "active" as const,
    completed: "success" as const,
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const status = event.resource?.status ?? "scheduled"
        return (
          <Link
            key={event.id}
            href={routes.scheduleDetail(event.id)}
            className="group flex gap-3 rounded-lg border bg-card p-3 transition-all hover:border-foreground/20 hover:shadow-sm"
          >
            {/* Time indicator */}
            <div className="flex w-14 flex-shrink-0 flex-col items-center justify-center rounded-md bg-muted/50 py-2 text-center">
              <span className="text-lg font-semibold leading-none">
                {format(event.start, "HH")}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(event.start, "mm")}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center gap-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-sm group-hover:text-foreground">
                  {event.title}
                </span>
                <StatusBadge status={statusMap[status]} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  {getDuration(event.start, event.end)}
                </span>
                <span>{getDateLabel(event.start, locale)}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
