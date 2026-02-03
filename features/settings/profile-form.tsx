"use client"

import * as React from "react"
import { UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfileAction } from "@/actions/settings"

export function ProfileForm() {
  const [isPending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    
    startTransition(async () => {
      const data = new FormData()
      data.append("firstName", formData.firstName)
      data.append("lastName", formData.lastName)
      data.append("email", formData.email)
      
      const result = await updateProfileAction({ success: false, error: null }, data)
      
      if (result.success) {
        setStatus({ type: "success", message: "Perfil atualizado com sucesso" })
      } else {
        setStatus({ type: "error", message: result.error || "Erro ao atualizar perfil" })
      }
    })
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserIcon className="size-8 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  placeholder="Seu nome"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  placeholder="Seu sobrenome"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isPending}
              />
            </div>
            
            {status && (
              <div className={`rounded-md p-3 text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-destructive/10 text-destructive"
              }`}>
                {status.message}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alteracoes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
