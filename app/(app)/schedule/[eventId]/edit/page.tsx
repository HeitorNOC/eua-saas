import { notFound } from "next/navigation"

import { PageHeader, PageSection } from "@/components/page/page-header"
import { RequireRole } from "@/components/auth/require-role"
import { EditEventForm } from "@/features/scheduling/edit-event-form"
import { fetchSchedule } from "@/features/scheduling/queries"
import { createTranslator } from "@/lib/i18n/translator"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function EditScheduleEventPage({
  params,
}: {
  params: { eventId: string }
}) {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const { eventId } = params
  const event = await fetchSchedule(eventId)

  if (!event) {
    notFound()
  }

  return (
    <RequireRole roles={["owner", "admin", "manager", "dispatcher"]}>
      <div className="space-y-6">
        <PageHeader
          title={t("nav.schedule")}
          description="Atualize horário, equipe e status."
        />
        <PageSection>
          <div className="rounded-lg border bg-card p-4">
            <EditEventForm
              event={{
                id: event.id,
                jobId: event.jobId,
                startTime: event.startTime,
                endTime: event.endTime ?? event.startTime,
                notes: event.notes,
                status: event.status,
              }}
            />
          </div>
        </PageSection>
      </div>
    </RequireRole>
  )
}
