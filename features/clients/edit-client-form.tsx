"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateClient } from "@/actions/clients"
import type { Client, UpdateClientInput } from "@/features/clients/schemas"
import { updateClientSchema } from "@/features/clients/schemas"

export function EditClientForm({ client }: { client: Client }) {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    mode: "onBlur",
    defaultValues: {
      id: client.id,
      name: client.name,
      email: client.email ?? undefined,
      phone: client.phone ?? undefined,
      address: client.address ?? undefined,
    },
  })

  const onSubmit = (data: UpdateClientInput) => {
    startTransition(async () => {
      setStatus(null)
      try {
        await updateClient(data)
        setStatus("Cliente atualizado com sucesso")
      } catch {
        setStatus("Não foi possível atualizar o cliente")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input {...register("name")} defaultValue={client.name} aria-invalid={!!errors.name} />
        {errors.name && <div className="text-red-600 text-xs">{errors.name.message}</div>}

        <Input {...register("email")} type="email" defaultValue={client.email ?? ""} aria-invalid={!!errors.email} />
        {errors.email && <div className="text-red-600 text-xs">{errors.email.message}</div>}

        <Input {...register("phone")} defaultValue={client.phone ?? ""} aria-invalid={!!errors.phone} />
        {errors.phone && <div className="text-red-600 text-xs">{errors.phone.message}</div>}

        <Input {...register("address")} defaultValue={client.address ?? ""} aria-invalid={!!errors.address} />
        {errors.address && <div className="text-red-600 text-xs">{errors.address.message}</div>}
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
