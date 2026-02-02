export type IntegrationType = "home_depot" | "bank" | "real_estate"

export type IntegrationStatus = "connected" | "disconnected" | "pending" | "error"

export interface Integration {
  id: string
  type: IntegrationType
  name: string
  description: string
  status: IntegrationStatus
  connectedAt?: string
  lastSync?: string
  config?: Record<string, unknown>
}

// Home Depot types
export interface HomeDepotProduct {
  sku: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  imageUrl?: string
  inStock: boolean
  storeLocation?: string
}

export interface HomeDepotSearchParams {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
}

// Bank integration types
export type BankProvider = "stripe" | "plaid" | "wise" | "mercury" | "brex"

export interface BankAccount {
  id: string
  name: string
  type: "checking" | "savings" | "business"
  currency: string
  balance: number
  lastFour: string
  institution: string
  provider: BankProvider
}

export interface BankTransaction {
  id: string
  accountId: string
  amount: number
  currency: string
  type: "credit" | "debit"
  category: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
  counterparty?: string
}

// Real estate integration types
export interface PropertyData {
  address: string
  city: string
  state: string
  zip: string
  squareFootage: number
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  estimatedValue: number
  lastSalePrice?: number
  lastSaleDate?: string
  propertyType: "single_family" | "condo" | "townhouse" | "multi_family" | "commercial"
}

// Integration service interface
export interface IntegrationService<TConfig = unknown> {
  connect: (config: TConfig) => Promise<void>
  disconnect: () => Promise<void>
  sync: () => Promise<void>
  getStatus: () => IntegrationStatus
}
