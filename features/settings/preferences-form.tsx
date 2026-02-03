"use client"

import * as React from "react"
import { MoonIcon, GlobeIcon, BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updatePreferencesAction } from "@/actions/settings"

type Preferences = {
  theme: "light" | "dark" | "system"
  language: "pt-BR" | "en-US" | "es-ES"
  notifications: "all" | "important" | "none"
}

type Props = {
  initialPreferences: Preferences
  locale: string
}

export function PreferencesForm({ initialPreferences, locale }: Props) {
  const [isPending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [preferences, setPreferences] = React.useState<Preferences>(initialPreferences)

  const handleSave = () => {
    setStatus(null)
    
    startTransition(async () => {
      const data = new FormData()
      data.append("theme", preferences.theme)
      data.append("language", preferences.language)
      data.append("notifications", preferences.notifications)
      
      const result = await updatePreferencesAction({ success: false, error: null }, data)
      
      if (result.success) {
        setStatus({ type: "success", message: "Preferencias salvas com sucesso" })
        // Reload page if language changed to apply new locale
        if (preferences.language !== locale) {
          window.location.reload()
        }
      } else {
        setStatus({ type: "error", message: result.error || "Erro ao salvar preferencias" })
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card divide-y">
        <PreferenceRow
          icon={<MoonIcon className="size-4" />}
          title="Tema"
          description="Escolha entre claro, escuro ou automatico."
        >
          <Select
            value={preferences.theme}
            onValueChange={(value: Preferences["theme"]) => 
              setPreferences(prev => ({ ...prev, theme: value }))
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </PreferenceRow>
        
        <PreferenceRow
          icon={<GlobeIcon className="size-4" />}
          title="Idioma"
          description="Selecione o idioma da interface."
        >
          <Select
            value={preferences.language}
            onValueChange={(value: Preferences["language"]) => 
              setPreferences(prev => ({ ...prev, language: value }))
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Portugues (BR)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Espanol</SelectItem>
            </SelectContent>
          </Select>
        </PreferenceRow>
        
        <PreferenceRow
          icon={<BellIcon className="size-4" />}
          title="Notificacoes"
          description="Receber alertas por email."
        >
          <Select
            value={preferences.notifications}
            onValueChange={(value: Preferences["notifications"]) => 
              setPreferences(prev => ({ ...prev, notifications: value }))
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="important">Importantes</SelectItem>
              <SelectItem value="none">Nenhuma</SelectItem>
            </SelectContent>
          </Select>
        </PreferenceRow>
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
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <>
              <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Salvando...
            </>
          ) : (
            "Salvar preferencias"
          )}
        </Button>
      </div>
    </div>
  )
}

function PreferenceRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
