import Link from "next/link"
import { CalendarDaysIcon, PlusIcon } from "lucide-react"

import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { createTranslator } from "@/lib/i18n/translator"
import { SchedulingCalendar } from "@/features/scheduling/calendar"
import { fetchSchedules } from "@/features/scheduling/queries"
import { fetchJobs } from "@/features/jobs/queries"
import { RequireRole } from "@/components/auth/require-role"
import { UpcomingEvents } from "@/components/scheduling/upcoming-events"
import { CreateEventForm } from "@/features/scheduling/create-event-form"
import type { ScheduleEvent } from "@/features/scheduling/types"
import { EmptyState } from "@/components/page/empty-state"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ApiError } from "@/lib/api/error"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function SchedulePage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  let schedules: Awaited<ReturnType<typeof fetchSchedules>> = []
  let jobMap = new Map<string, string>()
  let error: string | null = null

  try {
    const [scheduleData, jobs] = await Promise.all([
      fetchSchedules(200, 0),
      fetchJobs(200, 0),
    ])
    schedules = scheduleData
    jobMap = new Map(jobs.map((job) => [job.id, job.title]))
  } catch (err) {
    if (err instanceof ApiError) {
      error = err.message
    }
  }

  const events: ScheduleEvent[] = schedules.map((schedule) => {
    const title = jobMap.get(schedule.jobId) ?? "Evento"
    const status = ["scheduled", "in_progress", "completed"].includes(
      schedule.status
    )
      ? (schedule.status as "scheduled" | "in_progress" | "completed")
      : "scheduled"

    return {
      id: schedule.id,
      title,
      start: new Date(schedule.startTime),
      end: schedule.endTime
        ? new Date(schedule.endTime)
        : new Date(schedule.startTime),
      resource: {
        jobId: schedule.jobId,
        status,
      },
    }
  })

  const upcomingEvents = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  )

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <PageContainer>
        <PageHeader
          title={t("nav.schedule")}
          description="Calendario operacional com drag and drop integrado aos jobs."
          actions={
            <Button>
              <PlusIcon className="mr-2 size-4" />
              Novo evento
            </Button>
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro do backend</AlertTitle>
            <AlertDescription>
              {error}
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href={routes.schedule}>Tentar novamente</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <PageSection>
            {events.length > 0 ? (
              <div className="rounded-lg border bg-card p-4">
                <SchedulingCalendar locale={locale} events={events} />
              </div>
            ) : (
              <EmptyState
                title="Nenhum evento agendado"
                description="Crie um evento para preencher o calendario."
                icon={<CalendarDaysIcon className="size-6" />}
                action={
                  <Button>
                    <PlusIcon className="mr-2 size-4" />
                    Criar evento
                  </Button>
                }
              />
            )}
          </PageSection>

          <div className="space-y-6">
            <PageSection title="Proximos eventos">
              {upcomingEvents.length > 0 ? (
                <UpcomingEvents locale={locale} events={upcomingEvents} />
              ) : (
                <EmptyState
                  title="Sem eventos futuros"
                  description="Agende um evento para comecar."
                  className="py-8"
                />
              )}
            </PageSection>

            <PageSection title="Criar evento">
              <div className="rounded-lg border bg-card p-4">
                <CreateEventForm />
              </div>
            </PageSection>
          </div>
        </div>
      </PageContainer>
    </RequireRole>
  )
}
