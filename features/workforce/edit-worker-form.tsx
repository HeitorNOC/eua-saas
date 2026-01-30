"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateWorker } from "@/actions/workforce"
import type { Worker } from "@/features/workforce/schemas"

export function EditWorkerForm({ worker }: { worker: Worker }) {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)
  const [skills, setSkills] = React.useState(worker.skills.join(", "))
  const [notes, setNotes] = React.useState(worker.notes ?? "")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await updateWorker({
          id: worker.id,
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          workerType: String(form.get("workerType") ?? ""),
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          notes: notes || null,
          status: String(form.get("status") ?? worker.status),
        })
        setStatus("Profissional atualizado com sucesso")
      } catch {
        setStatus("Não foi possível atualizar o profissional")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="name" defaultValue={worker.name} required />
        <Input name="email" type="email" defaultValue={worker.email ?? ""} />
        <Input name="phone" defaultValue={worker.phone ?? ""} required />
        <Input name="workerType" defaultValue={worker.workerType} required />
        <Input name="status" defaultValue={worker.status} required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          name="skills"
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
          placeholder="Habilidades (separadas por vírgula)"
        />
        <Textarea
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Observações"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
