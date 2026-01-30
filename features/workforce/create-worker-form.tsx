"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createWorker } from "@/actions/workforce"

export function CreateWorkerForm() {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await createWorker({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          workerType: String(form.get("workerType") ?? ""),
          skills: String(form.get("skills") ?? "")
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          notes: String(form.get("notes") ?? "") || null,
        })
        setStatus("Profissional criado com sucesso")
        event.currentTarget.reset()
      } catch {
        setStatus("Não foi possível criar o profissional")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="name" placeholder="Nome do profissional" required />
        <Input name="email" type="email" placeholder="Email" />
        <Input name="phone" placeholder="Telefone" required />
        <Input name="workerType" placeholder="Tipo (ex: technician)" required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="skills" placeholder="Habilidades (separadas por vírgula)" />
        <Textarea name="notes" placeholder="Observações" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Adicionar profissional"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
