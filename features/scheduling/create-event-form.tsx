"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createScheduleEvent } from "@/actions/scheduling"

export function CreateEventForm() {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await createScheduleEvent({
          jobId: String(form.get("jobId") ?? ""),
          startTime: String(form.get("startTime") ?? ""),
          endTime: String(form.get("endTime") ?? ""),
          notes: String(form.get("notes") ?? "") || undefined,
          status: "scheduled",
        })
        setStatus("Evento criado com sucesso")
        event.currentTarget.reset()
      } catch {
        setStatus("Não foi possível criar o evento")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="jobId" placeholder="ID do job" required />
        <Input name="startTime" type="datetime-local" required />
        <Input name="endTime" type="datetime-local" />
        <Input name="notes" placeholder="Notas (opcional)" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Criar evento"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
