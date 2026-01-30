"use client"

import * as React from "react"

import type { Locale } from "@/config/site"
import { getMessages, type MessageKey } from "@/lib/i18n/messages"

type I18nContextValue = {
  locale: Locale
  messages: Record<MessageKey, string>
  t: (key: MessageKey) => string
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages?: Record<MessageKey, string>
  children: React.ReactNode
}) {
  const dictionary = messages ?? getMessages(locale)

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: dictionary,
      t: (key) => dictionary[key] ?? key,
    }),
    [dictionary, locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = React.useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }

  return context
}
