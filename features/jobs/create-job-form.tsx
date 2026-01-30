"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/actions/jobs"

export function CreateJobForm() {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await createJob({
          title: String(form.get("title") ?? ""),
          description: String(form.get("description") ?? ""),
          clientId: String(form.get("clientId") ?? ""),
        })
        setStatus("Job criado com sucesso")
        event.currentTarget.reset()
      } catch {
        setStatus("Não foi possível criar o job")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="title" placeholder="Título do job" required />
        <Input name="clientId" placeholder="ID do cliente" required />
      </div>
      <Textarea
        name="description"
        placeholder="Descrição do escopo"
        rows={3}
      />
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Criar job"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
