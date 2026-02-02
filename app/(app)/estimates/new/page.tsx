"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  PageContainer,
  PageHeader,
} from "@/components/page/page-container"
import { EstimateBuilder } from "@/features/estimates/estimate-builder"
import { routes } from "@/lib/routes"
import type { Estimate } from "@/features/estimates/types"

export default function NewEstimatePage() {
  const router = useRouter()

  // Em producao, isso viria do contexto do usuario
  const businessType = "construction" as const

  const handleSave = async (estimate: Estimate) => {
    try {
      // Em producao, salvaria no backend via GraphQL
      console.log("Saving estimate:", estimate)
      
      toast.success("Orcamento salvo com sucesso!")
      router.push(routes.estimates)
    } catch (error) {
      toast.error("Erro ao salvar orcamento")
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Novo Orcamento"
        description="Monte seu orcamento adicionando comodos, servicos e materiais"
        actions={
          <Button variant="outline" asChild>
            <Link href={routes.estimates}>
              <ArrowLeftIcon className="mr-2 size-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <EstimateBuilder
        businessType={businessType}
        onSave={handleSave}
      />
    </PageContainer>
  )
}
