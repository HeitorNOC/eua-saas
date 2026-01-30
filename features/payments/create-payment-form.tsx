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
import { createPayment } from "@/actions/payments"

export function CreatePaymentForm() {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)
  const [currency, setCurrency] = React.useState("BRL")
  const [method, setMethod] = React.useState("pix")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await createPayment({
          jobId: String(form.get("jobId") ?? ""),
          amount: Number(form.get("amount") ?? 0),
          currency,
          method,
        })
        setStatus("Pagamento criado com sucesso")
        event.currentTarget.reset()
        setCurrency("BRL")
        setMethod("pix")
      } catch {
        setStatus("Não foi possível criar o pagamento")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="jobId" placeholder="ID do job" required />
        <Input
          name="amount"
          type="number"
          min={0}
          step="0.01"
          placeholder="Valor"
          required
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="card">Cartão</SelectItem>
              <SelectItem value="bank_transfer">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Criar pagamento"}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </form>
  )
}
