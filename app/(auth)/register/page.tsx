"use client"

import Link from "next/link"
import { useEffect, useActionState, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

import { AuthForm } from "@/components/auth/auth-form"
import { FormField } from "@/components/auth/form-field"
import { routes } from "@/lib/routes"
import { registerAction } from "@/actions/auth"
import { cn } from "@/lib/utils"

// Validacoes de senha
const passwordRequirements = [
  { label: "Minimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiuscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Uma letra minuscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Um numero", test: (p: string) => /[0-9]/.test(p) },
]

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      {passwordRequirements.map((req, index) => {
        const passed = req.test(password)
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 text-xs",
              passed ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {passed ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {req.label}
          </div>
        )
      })}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(registerAction, { error: null, success: false })
  const hasSubmitted = useRef(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    // Apenas redireciona se o form foi submetido com sucesso
    if (state?.success && hasSubmitted.current) {
      // Novos usuarios vao para onboarding
      router.push(routes.onboarding)
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
        <div>
          <FormField
            name="password"
            type="password"
            label="Senha"
            placeholder="Crie uma senha segura"
            autoComplete="new-password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />
        </div>
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
