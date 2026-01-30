import type { ReactNode } from "react"
import Link from "next/link"
import { CommandIcon } from "lucide-react"

import { routes } from "@/lib/routes"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="relative hidden bg-foreground lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/90" />
        <div className="relative flex h-full flex-col justify-between p-10 text-background">
          <Link href={routes.login} className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-background text-foreground">
              <CommandIcon className="size-4" />
            </div>
            <span className="text-lg font-semibold">Field Services</span>
          </Link>
          <div className="space-y-4">
            <blockquote className="text-xl font-medium leading-relaxed">
              &ldquo;Essa plataforma transformou a forma como gerenciamos nossas
              operacoes de campo. A produtividade aumentou 40% no primeiro
              mes.&rdquo;
            </blockquote>
            <div>
              <p className="font-semibold">Carlos Silva</p>
              <p className="text-sm text-background/70">
                Diretor de Operacoes, TechField Solutions
              </p>
            </div>
          </div>
          <p className="text-sm text-background/60">
            2024 Field Services. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col">
        <div className="flex h-14 items-center border-b px-6 lg:hidden">
          <Link href={routes.login} className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <CommandIcon className="size-4" />
            </div>
            <span className="font-semibold">Field Services</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
