"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/actions/clients"
import { createClientSchema, type CreateClientInput } from "@/features/clients/schemas"

export function CreateClientForm() {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
  })

  const onSubmit = (data: CreateClientInput) => {
    startTransition(async () => {
      setStatus(null)
      try {
        await createClient(data)
        setStatus("Cliente criado com sucesso")
        reset()
      } catch (err) {
        setStatus("Não foi possível criar o cliente")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input {...register("name")} placeholder="Nome do cliente" aria-invalid={!!errors.name} />
        {errors.name && <div className="text-red-600 text-xs">{errors.name.message}</div>}

        <Input {...register("email")} type="email" placeholder="Email" aria-invalid={!!errors.email} />
        {errors.email && <div className="text-red-600 text-xs">{errors.email.message}</div>}

        <Input {...register("phone")} placeholder="Telefone" aria-invalid={!!errors.phone} />
        {errors.phone && <div className="text-red-600 text-xs">{errors.phone.message}</div>}

        <Input {...register("address")} placeholder="Endereço" aria-invalid={!!errors.address} />
        {errors.address && <div className="text-red-600 text-xs">{errors.address.message}</div>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Criar cliente"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
