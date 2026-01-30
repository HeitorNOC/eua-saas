import {
  BellIcon,
  GlobeIcon,
  KeyIcon,
  MoonIcon,
  PaletteIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

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
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/page/page-container"
import { DataCardGrid } from "@/components/cards/data-card"
import { RequireRole } from "@/components/auth/require-role"
import { createTranslator } from "@/lib/i18n/translator"
import { getLocaleFromCookies } from "@/lib/i18n/locale"
import { getSession } from "@/lib/auth/session"

export default async function SettingsPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const session = await getSession()

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <PageContainer>
        <PageHeader
          title="Configuracoes"
          description="Gerencie sua conta, preferencias e configuracoes da equipe."
        />

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="space-y-1">
            <SettingsNavItem icon={<UserIcon className="size-4" />} active>
              Perfil
            </SettingsNavItem>
            <SettingsNavItem icon={<KeyIcon className="size-4" />}>
              Seguranca
            </SettingsNavItem>
            <SettingsNavItem icon={<BellIcon className="size-4" />}>
              Notificacoes
            </SettingsNavItem>
            <SettingsNavItem icon={<PaletteIcon className="size-4" />}>
              Aparencia
            </SettingsNavItem>
            <SettingsNavItem icon={<GlobeIcon className="size-4" />}>
              Idioma e regiao
            </SettingsNavItem>
            <SettingsNavItem icon={<UsersIcon className="size-4" />}>
              Equipe
            </SettingsNavItem>
          </nav>

          <div className="space-y-8">
            <PageSection
              title="Informacoes do perfil"
              description="Atualize seus dados pessoais."
            >
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-start gap-6">
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input id="firstName" placeholder="Seu nome" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input id="lastName" placeholder="Seu sobrenome" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button>Salvar alteracoes</Button>
                    </div>
                  </div>
                </div>
              </div>
            </PageSection>

            <PageSection
              title="Preferencias"
              description="Personalize sua experiencia no sistema."
            >
              <div className="rounded-lg border bg-card divide-y">
                <PreferenceRow
                  icon={<MoonIcon className="size-4" />}
                  title="Tema"
                  description="Escolha entre claro, escuro ou automatico."
                >
                  <Select defaultValue="system">
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
                  <Select defaultValue={locale}>
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
                  <Select defaultValue="all">
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
            </PageSection>

            <PageSection
              title="Informacoes da conta"
              description="Dados da sua conta e organizacao."
            >
              <DataCardGrid
                items={[
                  { label: "ID do usuario", value: session?.userId ?? "-" },
                  { label: "ID da conta", value: session?.accountId ?? "-" },
                  {
                    label: "Funcoes",
                    value: session?.roles?.join(", ") ?? "-",
                  },
                  { label: "Plano", value: "Enterprise" },
                ]}
                columns={2}
              />
            </PageSection>

            <PageSection
              title="Zona de perigo"
              description="Acoes irreversiveis para sua conta."
            >
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium">Excluir conta</h4>
                    <p className="text-muted-foreground text-sm">
                      Uma vez excluida, todos os dados serao perdidos
                      permanentemente.
                    </p>
                  </div>
                  <Button variant="destructive">Excluir conta</Button>
                </div>
              </div>
            </PageSection>
          </div>
        </div>
      </PageContainer>
    </RequireRole>
  )
}

function SettingsNavItem({
  icon,
  children,
  active,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
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
