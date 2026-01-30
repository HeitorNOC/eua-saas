import type { Locale } from "@/config/site"
import { getMessages, type MessageKey } from "@/lib/i18n/messages"

export type Translator = {
  locale: Locale
  t: (key: MessageKey) => string
}

export function createTranslator(locale: Locale): Translator {
  const dict = getMessages(locale)

  return {
    locale,
    t: (key) => dict[key] ?? key,
  }
}
