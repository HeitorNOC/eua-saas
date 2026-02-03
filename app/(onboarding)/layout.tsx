import type { ReactNode } from "react"
import Link from "next/link"
import { CommandIcon } from "lucide-react"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
            <CommandIcon className="size-4" />
          </div>
          <span className="text-lg font-semibold">Field Services</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        {new Date().getFullYear()} Field Services. Todos os direitos reservados.
      </footer>
    </div>
  )
}
