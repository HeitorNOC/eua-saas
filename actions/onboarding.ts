"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { graphqlRequest } from "@/lib/api/graphql"
import { routes } from "@/lib/routes"
import { ActionState, successState, errorState } from "@/lib/actions/helpers"

// Schemas
const businessTypeSchema = z.enum(["cleaning", "construction"])
const setupSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa e obrigatorio"),
  language: z.enum(["pt-BR", "en-US", "es-ES"]),
  currency: z.enum(["BRL", "USD", "EUR"]),
})

export type BusinessType = z.infer<typeof businessTypeSchema>

// Cookie keys
const ONBOARDING_BUSINESS_TYPE_KEY = "onboarding_business_type"
const SUBSCRIPTION_ACTIVE_KEY = "subscription_active"
const LOCALE_KEY = "locale"

// Step 1: Save business type
export async function saveBusinessTypeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies()
  
  try {
    const businessType = businessTypeSchema.parse(formData.get("businessType"))
    
    // Save to cookie for now (will be persisted to backend on final step)
    cookieStore.set(ONBOARDING_BUSINESS_TYPE_KEY, businessType, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    })
    
    return successState({ businessType })
  } catch (err: any) {
    return errorState(err?.message || "Tipo de negocio invalido")
  }
}

// Helper to get business type from cookies
export async function getBusinessTypeFromCookies(): Promise<BusinessType | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ONBOARDING_BUSINESS_TYPE_KEY)?.value
  
  try {
    return businessTypeSchema.parse(value)
  } catch {
    return null
  }
}

// Step 2: Process subscription (mock for now, will integrate with Stripe)
export async function processSubscriptionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies()
  
  try {
    // TODO: Integrate with Stripe for real payment processing
    // For now, we simulate a successful subscription
    const planId = formData.get("planId") as string
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In production, this would:
    // 1. Create a Stripe checkout session
    // 2. Redirect to Stripe
    // 3. Handle webhook for subscription confirmation
    
    return successState({ planId, status: "pending" })
  } catch (err: any) {
    return errorState(err?.message || "Erro ao processar assinatura")
  }
}

// Step 3: Complete onboarding setup
export async function completeOnboardingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cookieStore = await cookies()
  
  try {
    const data = setupSchema.parse({
      companyName: formData.get("companyName"),
      language: formData.get("language"),
      currency: formData.get("currency"),
    })
    
    // Get business type from cookie
    const businessType = await getBusinessTypeFromCookies()
    if (!businessType) {
      return errorState("Tipo de negocio nao selecionado. Por favor, volte ao inicio.")
    }
    
    // TODO: Call GraphQL mutation to save account setup
    // const mutation = `
    //   mutation CompleteOnboarding($input: CompleteOnboardingInput!) {
    //     completeOnboarding(input: $input) {
    //       success
    //       account { id name businessType }
    //     }
    //   }
    // `
    // await graphqlRequest(mutation, {
    //   input: {
    //     companyName: data.companyName,
    //     businessType,
    //     language: data.language,
    //     currency: data.currency,
    //   }
    // })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Set subscription as active and locale
    cookieStore.set(SUBSCRIPTION_ACTIVE_KEY, "true", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    
    cookieStore.set(LOCALE_KEY, data.language, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    
    // Clear onboarding cookie
    cookieStore.delete(ONBOARDING_BUSINESS_TYPE_KEY)
    
    return successState({ 
      companyName: data.companyName,
      businessType,
      language: data.language,
      currency: data.currency,
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorState(err.errors[0]?.message || "Dados invalidos")
    }
    return errorState(err?.message || "Erro ao finalizar configuracao")
  }
}

// Redirect helper after successful setup
export async function redirectToDashboard() {
  redirect(routes.dashboard)
}

// Redirect helper for onboarding steps
export async function redirectToOnboardingStep(step: "business-type" | "subscription" | "setup") {
  const stepRoutes = {
    "business-type": routes.onboardingBusinessType,
    "subscription": routes.onboardingSubscription,
    "setup": routes.onboardingSetup,
  }
  redirect(stepRoutes[step])
}

// Cookie key for tour completion
const TOUR_COMPLETED_KEY = "onboarding_tour_completed"

// Mark onboarding tour as completed
export async function completeOnboardingTourAction(): Promise<ActionState> {
  const cookieStore = await cookies()
  
  try {
    cookieStore.set(TOUR_COMPLETED_KEY, "true", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
    
    return successState({ completed: true })
  } catch (err: any) {
    return errorState(err?.message || "Erro ao completar tour")
  }
}

// Check if onboarding tour has been completed
export async function hasCompletedOnboardingTour(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(TOUR_COMPLETED_KEY)?.value === "true"
}
