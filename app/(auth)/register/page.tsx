"use client"

import Link from "next/link"
import { useEffect, useActionState, useRef } from "react"
import { useRouter } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { FormField } from "@/components/auth/form-field"
import { routes } from "@/lib/routes"
import { registerAction } from "@/actions/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(registerAction, { error: null, success: false })
  const hasSubmitted = useRef(false)

  useEffect(() => {
    // Apenas redireciona se o form foi submetido com sucesso
    if (state?.success && hasSubmitted.current) {
      router.push(routes.dashboard)
      router.refresh()
    }
  }, [state, router])

  const handleAction = (formData: FormData) => {
    hasSubmitted.current = true
    formAction(formData)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Criar uma conta
        </h1>
        <p className="text-muted-foreground text-sm">
          Preencha os dados abaixo para comecar a usar a plataforma
        </p>
      </div>

      <AuthForm
        action={handleAction}
        submitLabel="Criar conta"
        error={state?.error}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="firstName"
            type="text"
            label="Nome"
            placeholder="Seu nome"
            autoComplete="given-name"
          />
          <FormField
            name="lastName"
            type="text"
            label="Sobrenome"
            placeholder="Seu sobrenome"
            autoComplete="family-name"
          />
        </div>
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
          placeholder="Minimo 8 caracteres"
          autoComplete="new-password"
          required
        />
        <p className="text-xs text-muted-foreground">
          Ao criar uma conta, voce concorda com nossos{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-foreground">
            Termos de Servico
          </Link>{" "}
          e{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-foreground">
            Politica de Privacidade
          </Link>
          .
        </p>
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
          Ja tem uma conta?{" "}
          <Link
            href={routes.login}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
