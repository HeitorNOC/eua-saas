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
import { updatePayment } from "@/actions/payments"
import type { Payment } from "@/features/payments/schemas"

export function EditPaymentForm({ payment }: { payment: Payment }) {
  const [pending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = React.useState(payment.status)
  const [method, setMethod] = React.useState(payment.method ?? "pix")
  const [paidAt, setPaidAt] = React.useState(
    payment.paidAt ? payment.paidAt.slice(0, 16) : ""
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    startTransition(async () => {
      setStatus(null)
      try {
        await updatePayment({
          id: payment.id,
          amount: Number(form.get("amount") ?? 0),
          status: paymentStatus,
          method,
          paidAt: paidAt ? new Date(paidAt).toISOString() : null,
        })
        setStatus("Pagamento atualizado com sucesso")
      } catch {
        setStatus("Não foi possível atualizar o pagamento")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          name="amount"
          type="number"
          min={0}
          step="0.01"
          defaultValue={payment.amount}
          required
        />
        <Input
          name="paidAt"
          type="datetime-local"
          value={paidAt}
          onChange={(event) => setPaidAt(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as typeof paymentStatus)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
            <SelectItem value="bank_transfer">Transferência</SelectItem>
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
