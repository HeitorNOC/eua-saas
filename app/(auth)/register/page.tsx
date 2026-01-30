import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerActionForm } from "@/actions/auth"
import { createTranslator } from "@/lib/i18n/translator"
import { routes } from "@/lib/routes"
import { getLocaleFromCookies } from "@/lib/i18n/locale"

export default async function RegisterPage() {
  const locale = await getLocaleFromCookies()
  const { t } = createTranslator(locale)

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("auth.register.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <form action={registerActionForm} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="firstName" placeholder={t("auth.firstName")} />
          <Input name="lastName" placeholder={t("auth.lastName")} />
        </div>
        <Input name="email" type="email" placeholder={t("auth.email")} required />
        <Input
          name="password"
          type="password"
          placeholder={t("auth.password")}
          required
        />
        <Button type="submit" className="w-full">
          {t("auth.createAccount")}
        </Button>
      </form>

      <div className="text-muted-foreground text-sm">
        {t("auth.hasAccount")} {" "}
        <Link className="text-primary font-medium" href={routes.login}>
          {t("auth.signIn")}
        </Link>
      </div>
    </div>
  )
}
