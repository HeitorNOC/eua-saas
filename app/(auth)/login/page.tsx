"use client"

import Link from "next/link"
import { useEffect, useActionState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { FormField } from "@/components/auth/form-field"
import { routes } from "@/lib/routes"
import { loginAction } from "@/actions/auth"
import { useActionToast } from "@/hooks/use-action-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const [state, formAction] = useActionState(loginAction, { error: null, success: false })
  const hasSubmitted = useRef(false)

  // Show toast on error (success redirects immediately)
  useActionToast(state, {
    errorPrefix: "Falha no login",
    showOnSuccess: false,
  })

  useEffect(() => {
    // Apenas redireciona se o form foi submetido com sucesso
    if (state?.success && hasSubmitted.current) {
      // Usar callback URL se disponivel, senao ir para dashboard
      const redirectTo = callbackUrl && callbackUrl.startsWith("/") 
        ? callbackUrl 
        : routes.dashboard
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, router, callbackUrl])

  const handleAction = (formData: FormData) => {
    hasSubmitted.current = true
    formAction(formData)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-muted-foreground text-sm">
          Entre com suas credenciais para acessar sua conta
        </p>
      </div>

      <AuthForm
        action={handleAction}
        submitLabel="Entrar"
        error={state?.error}
      >
        <FormField
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
        />
        <FormField
          name="password"
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          required
        />
      </AuthForm>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Nao tem uma conta?{" "}
          <Link
            href={routes.register}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
