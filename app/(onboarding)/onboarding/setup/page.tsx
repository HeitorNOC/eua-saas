"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { CheckIcon, ArrowRightIcon, BuildingIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { routes } from "@/lib/routes"
import { completeOnboardingAction } from "@/actions/onboarding"

const languages = [
  { value: "pt-BR", label: "Portugues (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Espanol" },
]

const currencies = [
  { value: "BRL", label: "Real (R$)" },
  { value: "USD", label: "Dollar ($)" },
  { value: "EUR", label: "Euro (E)" },
]

export default function SetupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    language: "pt-BR",
    currency: "BRL",
  })

  const handleComplete = () => {
    if (!formData.companyName.trim()) {
      setError("Nome da empresa e obrigatorio")
      return
    }

    setError(null)
    startTransition(async () => {
      const data = new FormData()
      data.append("companyName", formData.companyName)
      data.append("language", formData.language)
      data.append("currency", formData.currency)
      
      const result = await completeOnboardingAction({ success: false, error: null }, data)
      
      if (result.success) {
        router.push(routes.dashboard)
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full bg-foreground transition-all" />
        </div>
        <span className="text-sm text-muted-foreground">Etapa 3 de 3</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-foreground/10">
          <BuildingIcon className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configure sua conta
        </h1>
        <p className="text-muted-foreground">
          Ultimos detalhes para personalizar sua experiencia.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da empresa</Label>
          <Input
            id="companyName"
            placeholder="Ex: Silva Construcoes"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma padrao</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              disabled={isPending}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              disabled={isPending}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Success indicator */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white">
            <CheckIcon className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
              Plano selecionado
            </h4>
            <p className="text-xs text-green-700 dark:text-green-300">
              Sua conta sera ativada assim que finalizar a configuracao.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <Button
        onClick={handleComplete}
        disabled={isPending || !formData.companyName.trim()}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Finalizando...
          </>
        ) : (
          <>
            Comecar a usar
            <ArrowRightIcon className="ml-2 size-4" />
          </>
        )}
      </Button>
    </div>
  )
}
