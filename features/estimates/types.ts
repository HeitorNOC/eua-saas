export type RoomType =
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "living_room"
  | "dining_room"
  | "office"
  | "garage"
  | "basement"
  | "attic"
  | "laundry"
  | "hallway"
  | "outdoor"
  | "other"

export type ServiceType =
  // Cleaning services
  | "deep_cleaning"
  | "regular_cleaning"
  | "window_cleaning"
  | "carpet_cleaning"
  | "move_in_out"
  // Construction services
  | "painting"
  | "flooring"
  | "electrical"
  | "plumbing"
  | "drywall"
  | "tiling"
  | "carpentry"
  | "demolition"
  | "general_repair"

export interface RoomService {
  id: string
  serviceType: ServiceType
  quantity: number
  unitPrice: number
  notes?: string
}

export interface Material {
  id: string
  name: string
  quantity: number
  unitPrice: number
  supplier?: string
  sku?: string
}

export interface Room {
  id: string
  type: RoomType
  name: string
  squareFootage: number
  services: RoomService[]
  materials: Material[]
}

export interface Estimate {
  id: string
  jobId?: string
  clientId: string
  businessType: "cleaning" | "construction"
  status: "draft" | "sent" | "approved" | "rejected" | "expired"
  rooms: Room[]
  laborHours: number
  laborRate: number
  helpers: number
  helperRate: number
  discount: number
  taxRate: number
  notes?: string
  validUntil?: string
  createdAt: string
  updatedAt: string
}

// Calculated values
export interface EstimateSummary {
  materialsTotal: number
  servicesTotal: number
  laborTotal: number
  helpersTotal: number
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

// Room type labels
export const roomTypeLabels: Record<RoomType, string> = {
  bedroom: "Quarto",
  bathroom: "Banheiro",
  kitchen: "Cozinha",
  living_room: "Sala de Estar",
  dining_room: "Sala de Jantar",
  office: "Escritorio",
  garage: "Garagem",
  basement: "Porao",
  attic: "Sotao",
  laundry: "Lavanderia",
  hallway: "Corredor",
  outdoor: "Area Externa",
  other: "Outro",
}

// Service type labels and default prices
export const serviceTypeConfig: Record<ServiceType, { label: string; defaultPrice: number; unit: string }> = {
  // Cleaning
  deep_cleaning: { label: "Limpeza Profunda", defaultPrice: 5, unit: "sqft" },
  regular_cleaning: { label: "Limpeza Regular", defaultPrice: 2.5, unit: "sqft" },
  window_cleaning: { label: "Limpeza de Vidros", defaultPrice: 15, unit: "janela" },
  carpet_cleaning: { label: "Limpeza de Carpete", defaultPrice: 3, unit: "sqft" },
  move_in_out: { label: "Move In/Out", defaultPrice: 8, unit: "sqft" },
  // Construction
  painting: { label: "Pintura", defaultPrice: 4, unit: "sqft" },
  flooring: { label: "Piso", defaultPrice: 12, unit: "sqft" },
  electrical: { label: "Eletrica", defaultPrice: 85, unit: "hora" },
  plumbing: { label: "Hidraulica", defaultPrice: 95, unit: "hora" },
  drywall: { label: "Drywall", defaultPrice: 6, unit: "sqft" },
  tiling: { label: "Azulejo/Ceramica", defaultPrice: 15, unit: "sqft" },
  carpentry: { label: "Carpintaria", defaultPrice: 75, unit: "hora" },
  demolition: { label: "Demolicao", defaultPrice: 3, unit: "sqft" },
  general_repair: { label: "Reparo Geral", defaultPrice: 65, unit: "hora" },
}

// Helper function to calculate estimate totals
export function calculateEstimateSummary(estimate: Estimate): EstimateSummary {
  let materialsTotal = 0
  let servicesTotal = 0

  for (const room of estimate.rooms) {
    for (const material of room.materials) {
      materialsTotal += material.quantity * material.unitPrice
    }
    for (const service of room.services) {
      servicesTotal += service.quantity * service.unitPrice
    }
  }

  const laborTotal = estimate.laborHours * estimate.laborRate
  const helpersTotal = estimate.helpers * estimate.helperRate * estimate.laborHours

  const subtotal = materialsTotal + servicesTotal + laborTotal + helpersTotal
  const discountAmount = subtotal * (estimate.discount / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (estimate.taxRate / 100)
  const total = afterDiscount + taxAmount

  return {
    materialsTotal,
    servicesTotal,
    laborTotal,
    helpersTotal,
    subtotal,
    discountAmount,
    taxAmount,
    total,
  }
}
