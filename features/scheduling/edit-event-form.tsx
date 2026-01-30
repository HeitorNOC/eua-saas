"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateScheduleEvent } from "@/actions/scheduling"
import type { ScheduleEventInput } from "@/features/scheduling/schemas"

export function EditEventForm({ event }: { event: ScheduleEventInput }) {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)
  const [eventStatus, setEventStatus] = React.useState(event.status)

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    const form = new FormData(formEvent.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await updateScheduleEvent({
          id: event.id,
          jobId: String(form.get("jobId") ?? ""),
          startTime: String(form.get("start") ?? ""),
          endTime: String(form.get("end") ?? "") || undefined,
          notes: String(form.get("notes") ?? "") || undefined,
          status: eventStatus,
        })
        setStatus("Evento atualizado com sucesso")
      } catch {
        setStatus("Não foi possível atualizar o evento")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="jobId" defaultValue={event.jobId} required />
        <Input
          name="start"
          type="datetime-local"
          defaultValue={event.startTime.slice(0, 16)}
          required
        />
        <Input
          name="end"
          type="datetime-local"
          defaultValue={event.endTime?.slice(0, 16) ?? ""}
        />
        <Input name="notes" defaultValue={event.notes ?? ""} placeholder="Notas" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={eventStatus} onValueChange={(value) => setEventStatus(value as typeof eventStatus)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
