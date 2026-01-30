"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateJob } from "@/actions/jobs"
import type { Job } from "@/features/jobs/schemas"

export function EditJobForm({ job }: { job: Job }) {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)
  const [jobStatus, setJobStatus] = React.useState(
    job.status ?? "scheduled"
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await updateJob({
          id: job.id,
          title: String(form.get("title") ?? ""),
          description: String(form.get("description") ?? ""),
          status: jobStatus,
        })
        setStatus("Job atualizado com sucesso")
      } catch {
        setStatus("Não foi possível atualizar o job")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="title" defaultValue={job.title} required />
        <Input name="clientId" defaultValue={job.clientId ?? ""} />
      </div>
      <Textarea
        name="description"
        defaultValue={job.description ?? ""}
        placeholder="Descrição do escopo"
        rows={3}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={jobStatus}
          onValueChange={(value) => setJobStatus(value as typeof jobStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
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
