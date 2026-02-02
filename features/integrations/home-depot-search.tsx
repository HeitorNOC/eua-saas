"use client"

import { useState } from "react"
import { SearchIcon, PlusIcon, PackageIcon, ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HomeDepotProduct } from "./types"

// Mock products - em producao viria da API do Home Depot
const mockProducts: HomeDepotProduct[] = [
  {
    sku: "HD-001",
    name: "Tinta Acrilica Premium - Branco 3.6L",
    description: "Tinta acrilica de alta cobertura para paredes internas e externas",
    price: 89.99,
    unit: "galao",
    category: "Tintas",
    inStock: true,
    storeLocation: "Corredor 12, Prateleira A",
  },
  {
    sku: "HD-002",
    name: "Piso Porcelanato 60x60cm - Cinza",
    description: "Piso porcelanato retificado, acabamento acetinado",
    price: 54.99,
    unit: "m2",
    category: "Pisos",
    inStock: true,
    storeLocation: "Corredor 8, Pilha B",
  },
  {
    sku: "HD-003",
    name: "Cabo Flexivel 2.5mm - 100m",
    description: "Cabo eletrico flexivel para instalacoes residenciais",
    price: 189.99,
    unit: "rolo",
    category: "Eletrica",
    inStock: true,
    storeLocation: "Corredor 15, Prateleira C",
  },
  {
    sku: "HD-004",
    name: "Tubo PVC 100mm - 3m",
    description: "Tubo PVC para esgoto, conexoes de 100mm",
    price: 45.99,
    unit: "unidade",
    category: "Hidraulica",
    inStock: false,
  },
  {
    sku: "HD-005",
    name: "Massa Corrida PVA 25kg",
    description: "Massa corrida para preparo de paredes antes da pintura",
    price: 59.99,
    unit: "balde",
    category: "Tintas",
    inStock: true,
    storeLocation: "Corredor 12, Prateleira B",
  },
]

interface HomeDepotSearchProps {
  onSelect: (product: HomeDepotProduct) => void
}

export function HomeDepotSearch({ onSelect }: HomeDepotSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HomeDepotProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    // Simula busca na API
    await new Promise(resolve => setTimeout(resolve, 500))

    const filtered = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered)
    setIsSearching(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar materiais no Home Depot..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {results.map((product) => (
              <div
                key={product.sku}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <PackageIcon className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>SKU: {product.sku}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                      {!product.inStock && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">Fora de estoque</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">/{product.unit}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onSelect(product)}
                    disabled={!product.inStock}
                  >
                    <PlusIcon className="mr-1 size-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && query && !isSearching && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
          <PackageIcon className="mx-auto mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nenhum produto encontrado para &quot;{query}&quot;
          </p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
        <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
          <PackageIcon className="size-4" />
          <span>Powered by Home Depot API</span>
        </div>
        <Button variant="link" size="sm" className="h-auto p-0 text-orange-700 dark:text-orange-300">
          <ExternalLinkIcon className="mr-1 size-3" />
          Abrir no Home Depot
        </Button>
      </div>
    </div>
  )
}
