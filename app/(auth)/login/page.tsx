"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFormState } from "react-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTranslator } from "@/lib/i18n/translator"
import { routes } from "@/lib/routes"
import { loginSchema } from "@/features/auth/schemas"
import type { LoginInput } from "@/features/auth/schemas"
import { loginAction } from "@/actions/auth"

export default function LoginPage() {
	const locale = "pt-BR"
	const { t } = createTranslator(locale)
	const router = useRouter()

	const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
	})

	const [state, formAction] = useFormState(loginAction, { error: null })

	useEffect(() => {
		if (state && !state.error) {
			router.push(routes.dashboard)
		}
	}, [state, router])

	const onSubmit = (data: LoginInput) => {
		const fd = new FormData()
		fd.append("email", data.email)
		fd.append("password", data.password)
		formAction(fd)
	}

	return (
		<div className="space-y-4 max-w-sm mx-auto">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold">{t("auth.login.title")}</h1>
				<p className="text-muted-foreground text-sm">{t("auth.login.subtitle")}</p>
			</div>

			{state?.error && (
				<div className="bg-red-100 border border-red-300 text-red-700 rounded p-3 mb-2">{state.error}</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
				<Input {...register("email")} type="email" placeholder={t("auth.email")} autoComplete="username" aria-invalid={!!errors.email} />
				{errors.email && <div className="text-red-600 text-xs">{errors.email.message}</div>}

				<Input {...register("password")} type="password" placeholder={t("auth.password")} autoComplete="current-password" aria-invalid={!!errors.password} />
				{errors.password && <div className="text-red-600 text-xs">{errors.password.message}</div>}

				<Button type="submit" className="w-full">{t("auth.signIn")}</Button>
			</form>

			<div className="text-muted-foreground text-sm">
				{t("auth.noAccount")} <Link className="text-primary font-medium" href={routes.register}>{t("auth.register")}</Link>
			</div>
		</div>
	)
}

