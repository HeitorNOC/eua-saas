import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"

// Redireciona para a primeira etapa do onboarding
export default function OnboardingPage() {
  redirect(routes.onboardingBusinessType)
}
