import { Suspense } from "react"
import {
  BellIcon,
  GlobeIcon,
  KeyIcon,
  MoonIcon,
  PaletteIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

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
import { getPreferencesFromCookies } from "@/actions/settings"
import { ProfileForm } from "@/features/settings/profile-form"
import { PreferencesForm } from "@/features/settings/preferences-form"
import { SecurityForm } from "@/features/settings/security-form"
import { DangerZone } from "@/features/settings/danger-zone"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SettingsPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)
  const session = await getSession()
  const preferences = await getPreferencesFromCookies()

  return (
    <RequireRole roles={["owner", "admin", "manager"]}>
      <PageContainer>
        <PageHeader
          title="Configuracoes"
          description="Gerencie sua conta, preferencias e configuracoes da equipe."
        />

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="space-y-1">
            <SettingsNavItem icon={<UserIcon className="size-4" />} href="#profile" active>
              Perfil
            </SettingsNavItem>
            <SettingsNavItem icon={<KeyIcon className="size-4" />} href="#security">
              Seguranca
            </SettingsNavItem>
            <SettingsNavItem icon={<PaletteIcon className="size-4" />} href="#preferences">
              Preferencias
            </SettingsNavItem>
            <SettingsNavItem icon={<UsersIcon className="size-4" />} href="#account">
              Conta
            </SettingsNavItem>
          </nav>

          <div className="space-y-8">
            {/* Profile Section */}
            <PageSection
              id="profile"
              title="Informacoes do perfil"
              description="Atualize seus dados pessoais."
            >
              <Suspense fallback={<FormSkeleton />}>
                <ProfileForm />
              </Suspense>
            </PageSection>

            {/* Security Section */}
            <PageSection
              id="security"
              title="Seguranca"
              description="Gerencie sua senha e autenticacao."
            >
              <Suspense fallback={<FormSkeleton />}>
                <SecurityForm />
              </Suspense>
            </PageSection>

            {/* Preferences Section */}
            <PageSection
              id="preferences"
              title="Preferencias"
              description="Personalize sua experiencia no sistema."
            >
              <Suspense fallback={<FormSkeleton />}>
                <PreferencesForm initialPreferences={preferences} locale={locale} />
              </Suspense>
            </PageSection>

            {/* Account Info Section */}
            <PageSection
              id="account"
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
                  { label: "Plano", value: "Profissional" },
                ]}
                columns={2}
              />
            </PageSection>

            {/* Danger Zone */}
            <PageSection
              title="Zona de perigo"
              description="Acoes irreversiveis para sua conta."
            >
              <Suspense fallback={<FormSkeleton />}>
                <DangerZone />
              </Suspense>
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
  href,
  active,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  href: string
  active?: boolean
}) {
  return (
    <a
      href={href}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </a>
  )
}

function FormSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
