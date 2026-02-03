"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePasswordAction } from "@/actions/settings"

export function SecurityForm() {
  const [isPending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: "error", message: "As senhas nao conferem" })
      return
    }
    
    if (formData.newPassword.length < 8) {
      setStatus({ type: "error", message: "A nova senha deve ter pelo menos 8 caracteres" })
      return
    }
    
    startTransition(async () => {
      const data = new FormData()
      data.append("currentPassword", formData.currentPassword)
      data.append("newPassword", formData.newPassword)
      data.append("confirmPassword", formData.confirmPassword)
      
      const result = await changePasswordAction({ success: false, error: null }, data)
      
      if (result.success) {
        setStatus({ type: "success", message: "Senha alterada com sucesso" })
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setStatus({ type: "error", message: result.error || "Erro ao alterar senha" })
      }
    })
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha atual</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Digite sua senha atual"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.current ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Minimo 8 caracteres"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Repita a nova senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>
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
                Alterando...
              </>
            ) : (
              "Alterar senha"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
