"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  DollarSignIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"

const features = [
  {
    icon: ClipboardListIcon,
    title: "Orcamentos Inteligentes",
    description:
      "Crie orcamentos profissionais em minutos com nosso builder visual. Adicione comodos, servicos e materiais automaticamente.",
  },
  {
    icon: CalendarIcon,
    title: "Agendamento Simplificado",
    description:
      "Gerencie sua equipe e agendamentos em um so lugar. Arraste e solte para reorganizar facilmente.",
  },
  {
    icon: UsersIcon,
    title: "Gestao de Clientes",
    description:
      "Mantenha historico completo de cada cliente, servicos realizados e preferencias.",
  },
  {
    icon: DollarSignIcon,
    title: "Controle Financeiro",
    description:
      "Acompanhe pagamentos, gere relatorios e tenha visao completa do seu faturamento.",
  },
]

const stats = [
  { value: "40%", label: "Aumento de produtividade" },
  { value: "2h", label: "Economizadas por dia" },
  { value: "500+", label: "Empresas ativas" },
  { value: "98%", label: "Satisfacao dos clientes" },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={routes.home} className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <ZapIcon className="size-4 text-background" />
            </div>
            <span className="text-lg font-semibold">FieldPro</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Recursos
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Precos
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sobre
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={routes.login}>Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={routes.register}>Comecar agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
                <SparklesIcon className="size-4 text-amber-500" />
                <span>Novo: Integracoes com Home Depot e Bancos</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Gestao completa para servicos de campo
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
                Simplifique orcamentos, agendamentos e pagamentos. A plataforma
                perfeita para empresas de limpeza e construcao.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <Link href={routes.register}>
                    Comecar gratuitamente
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">Ver recursos</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tudo que voce precisa em um so lugar
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ferramentas poderosas para gerenciar seu negocio de servicos de
                campo de forma eficiente.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
                    <feature.icon className="size-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Types Section */}
        <section className="border-y bg-muted/30 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Feito para o seu tipo de negocio
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Solucoes adaptadas para diferentes segmentos de servicos de
                campo.
              </p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {/* Cleaning */}
              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600">
                    <SparklesIcon className="size-4" />
                    Limpeza
                  </div>
                  <h3 className="text-2xl font-bold">Servicos de Limpeza</h3>
                  <p className="mt-2 text-muted-foreground">
                    Residencial, comercial, pos-obra. Gerencie frequencias,
                    equipes e orcamentos de forma simples.
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {[
                      "Orcamento por area ou preco fixo",
                      "Frequencia de servico configuravel",
                      "Gestao de equipes e escalas",
                      "Checklist de servicos por comodo",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <CheckCircleIcon className="size-5 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Construction */}
              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
                    <ClipboardListIcon className="size-4" />
                    Construcao
                  </div>
                  <h3 className="text-2xl font-bold">Construcao e Reformas</h3>
                  <p className="mt-2 text-muted-foreground">
                    Obras, reformas, manutencao. Controle materiais, mao de obra
                    e prazos com precisao.
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {[
                      "Integracao com Home Depot",
                      "Orcamento por comodo e area",
                      "Controle de materiais e custos",
                      "Cronograma de etapas do projeto",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <CheckCircleIcon className="size-5 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Preco simples e transparente
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Um plano completo com tudo que voce precisa. Sem surpresas.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-lg">
              <div className="rounded-2xl border-2 border-foreground bg-card p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Plano Profissional</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      R$99
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cobranca mensal. Cancele quando quiser.
                  </p>
                </div>
                <ul className="mt-8 space-y-3">
                  {[
                    "Usuarios ilimitados",
                    "Orcamentos ilimitados",
                    "Agendamento e calendario",
                    "Gestao de clientes e equipe",
                    "Relatorios e dashboard",
                    "Integracoes com Home Depot e Bancos",
                    "Suporte prioritario",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircleIcon className="size-5 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" size="lg" asChild>
                  <Link href={routes.register}>Comecar agora</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-foreground py-20 text-background sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para transformar seu negocio?
              </h2>
              <p className="mt-4 text-lg text-background/70">
                Junte-se a centenas de empresas que ja simplificaram sua gestao
                com FieldPro.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 gap-2"
                asChild
              >
                <Link href={routes.register}>
                  Criar conta gratuita
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground">
                <ZapIcon className="size-3.5 text-background" />
              </div>
              <span className="font-semibold">FieldPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 FieldPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
