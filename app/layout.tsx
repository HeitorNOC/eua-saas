import type { Metadata } from "next"
import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { siteConfig, type Locale } from "@/config/site"
import { I18nProvider } from "@/components/providers/i18n-provider"
import { getMessages } from "@/lib/i18n/messages"
import { getThemeFromCookies, themeToCssVariables } from "@/lib/theme"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("locale")?.value
  const locale: Locale = siteConfig.locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : siteConfig.defaultLocale
  const theme = getThemeFromCookies(cookieStore)
  const messages = getMessages(locale)

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body
        style={themeToCssVariables(theme)}
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${
          theme.mode === "dark" ? "dark" : ""
        }`}
      >
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
