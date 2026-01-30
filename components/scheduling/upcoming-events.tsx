import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatters"
import type { Locale } from "@/config/site"
import { routes } from "@/lib/routes"
import type { ScheduleEvent } from "@/features/scheduling/types"

export function UpcomingEvents({
  locale,
  events,
}: {
  locale: Locale
  events: ScheduleEvent[]
}) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Link
          key={event.id}
          href={routes.scheduleDetail(event.id)}
          className="hover:bg-muted/50 rounded-lg border p-3 text-sm transition"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">{event.title}</div>
            {event.resource?.status ? (
              <Badge variant={event.resource.status === "completed" ? "secondary" : "outline"}>
                {event.resource.status}
              </Badge>
            ) : null}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {formatDate(event.start, locale)} · Job {event.resource?.jobId ?? "-"}
          </div>
        </Link>
      ))}
    </div>
  )
}
