export const siteConfig = {
  name: "USA SaaS",
  description:
    "Plataforma SaaS enterprise para gestão de serviços de campo com foco em performance e escalabilidade.",
  defaultLocale: "pt-BR",
  locales: ["pt-BR", "en-US", "es-ES"],
} as const

export type Locale = (typeof siteConfig.locales)[number]
