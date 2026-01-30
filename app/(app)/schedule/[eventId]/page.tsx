import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { Button } from "@/components/ui/button"
import { fetchSchedule } from "@/features/scheduling/queries"
import { fetchJob } from "@/features/jobs/queries"
import { RequireRole } from "@/components/auth/require-role"
import { formatDate } from "@/lib/formatters"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function ScheduleEventPage({
  params,
}: {
  params: { eventId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { eventId } = params
  const schedule = await fetchSchedule(eventId)
  const jobTitle = schedule ? (await fetchJob(schedule.jobId))?.title : null

  if (!schedule) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={jobTitle ?? "Evento"}
          description="Detalhes do evento"
          actions={
            <Button asChild variant="outline">
              <Link href={routes.scheduleEdit(schedule.id)}>Editar</Link>
            </Button>
          }
        />

        <PageSection title="Resumo">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">Data</div>
              <div className="text-sm font-medium">
                {formatDate(schedule.startTime, locale)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="text-sm font-medium">{schedule.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Job</div>
              <div className="text-sm font-medium">{jobTitle ?? "Job"}</div>
            </div>
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
