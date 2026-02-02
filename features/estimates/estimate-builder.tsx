"use client"

import { useState, useCallback } from "react"
import {
  PlusIcon,
  TrashIcon,
  HomeIcon,
  WrenchIcon,
  PackageIcon,
  CalculatorIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  type Estimate,
  type Room,
  type RoomType,
  type ServiceType,
  type RoomService,
  type Material,
  roomTypeLabels,
  serviceTypeConfig,
  calculateEstimateSummary,
} from "./types"

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

interface EstimateBuilderProps {
  businessType: "cleaning" | "construction"
  initialData?: Partial<Estimate>
  onSave: (estimate: Estimate) => void
}

export function EstimateBuilder({ businessType, initialData, onSave }: EstimateBuilderProps) {
  const [estimate, setEstimate] = useState<Estimate>({
    id: initialData?.id || generateId(),
    clientId: initialData?.clientId || "",
    businessType,
    status: "draft",
    rooms: initialData?.rooms || [],
    laborHours: initialData?.laborHours || 0,
    laborRate: initialData?.laborRate || 50,
    helpers: initialData?.helpers || 0,
    helperRate: initialData?.helperRate || 25,
    discount: initialData?.discount || 0,
    taxRate: initialData?.taxRate || 0,
    notes: initialData?.notes || "",
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

  const summary = calculateEstimateSummary(estimate)

  // Room management
  const addRoom = useCallback(() => {
    const newRoom: Room = {
      id: generateId(),
      type: "bedroom",
      name: "",
      squareFootage: 0,
      services: [],
      materials: [],
    }
    setEstimate(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }))
    setActiveRoomId(newRoom.id)
  }, [])

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId ? { ...room, ...updates } : room
      ),
    }))
  }, [])

  const removeRoom = useCallback((roomId: string) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.filter(room => room.id !== roomId),
    }))
    if (activeRoomId === roomId) {
      setActiveRoomId(null)
    }
  }, [activeRoomId])

  // Service management
  const addService = useCallback((roomId: string) => {
    const defaultType: ServiceType = businessType === "cleaning" ? "regular_cleaning" : "painting"
    const config = serviceTypeConfig[defaultType]
    const newService: RoomService = {
      id: generateId(),
      serviceType: defaultType,
      quantity: 1,
      unitPrice: config.defaultPrice,
    }
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? { ...room, services: [...room.services, newService] }
          : room
      ),
    }))
  }, [businessType])

  const updateService = useCallback((roomId: string, serviceId: string, updates: Partial<RoomService>) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              services: room.services.map(service =>
                service.id === serviceId ? { ...service, ...updates } : service
              ),
            }
          : room
      ),
    }))
  }, [])

  const removeService = useCallback((roomId: string, serviceId: string) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? { ...room, services: room.services.filter(s => s.id !== serviceId) }
          : room
      ),
    }))
  }, [])

  // Material management (construction only)
  const addMaterial = useCallback((roomId: string) => {
    const newMaterial: Material = {
      id: generateId(),
      name: "",
      quantity: 1,
      unitPrice: 0,
    }
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? { ...room, materials: [...room.materials, newMaterial] }
          : room
      ),
    }))
  }, [])

  const updateMaterial = useCallback((roomId: string, materialId: string, updates: Partial<Material>) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              materials: room.materials.map(material =>
                material.id === materialId ? { ...material, ...updates } : material
              ),
            }
          : room
      ),
    }))
  }, [])

  const removeMaterial = useCallback((roomId: string, materialId: string) => {
    setEstimate(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId
          ? { ...room, materials: room.materials.filter(m => m.id !== materialId) }
          : room
      ),
    }))
  }, [])

  const activeRoom = estimate.rooms.find(r => r.id === activeRoomId)

  const cleaningServices: ServiceType[] = [
    "deep_cleaning", "regular_cleaning", "window_cleaning", "carpet_cleaning", "move_in_out"
  ]
  const constructionServices: ServiceType[] = [
    "painting", "flooring", "electrical", "plumbing", "drywall", "tiling", "carpentry", "demolition", "general_repair"
  ]
  const availableServices = businessType === "cleaning" ? cleaningServices : constructionServices

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      {/* Main Builder Area */}
      <div className="space-y-6">
        {/* Rooms List */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <HomeIcon className="size-5" />
              <h3 className="font-semibold">Comodos</h3>
              <span className="text-sm text-muted-foreground">({estimate.rooms.length})</span>
            </div>
            <Button onClick={addRoom} size="sm">
              <PlusIcon className="mr-2 size-4" />
              Adicionar Comodo
            </Button>
          </div>

          {estimate.rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <HomeIcon className="mb-4 size-12 text-muted-foreground/50" />
              <h4 className="font-medium">Nenhum comodo adicionado</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Adicione comodos para comecar a montar seu orcamento.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {estimate.rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setActiveRoomId(room.id)}
                  className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                    activeRoomId === room.id ? "bg-accent" : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {room.name || roomTypeLabels[room.type]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {room.squareFootage} sqft - {room.services.length} servico(s)
                      {businessType === "construction" && ` - ${room.materials.length} material(is)`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRoom(room.id)
                    }}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Room Editor */}
        {activeRoom && (
          <div className="space-y-6 rounded-xl border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Tipo de Comodo</Label>
                <Select
                  value={activeRoom.type}
                  onValueChange={(value: RoomType) => updateRoom(activeRoom.id, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(roomTypeLabels) as RoomType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {roomTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome (opcional)</Label>
                <Input
                  placeholder="Ex: Quarto Principal"
                  value={activeRoom.name}
                  onChange={(e) => updateRoom(activeRoom.id, { name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Area (sqft)</Label>
                <Input
                  type="number"
                  min="0"
                  value={activeRoom.squareFootage || ""}
                  onChange={(e) => updateRoom(activeRoom.id, { squareFootage: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="size-4" />
                  <h4 className="font-medium">Servicos</h4>
                </div>
                <Button size="sm" variant="outline" onClick={() => addService(activeRoom.id)}>
                  <PlusIcon className="mr-2 size-4" />
                  Adicionar
                </Button>
              </div>

              {activeRoom.services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum servico adicionado.</p>
              ) : (
                <div className="space-y-3">
                  {activeRoom.services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      <Select
                        value={service.serviceType}
                        onValueChange={(value: ServiceType) => {
                          const config = serviceTypeConfig[value]
                          updateService(activeRoom.id, service.id, {
                            serviceType: value,
                            unitPrice: config.defaultPrice,
                          })
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map((type) => (
                            <SelectItem key={type} value={type}>
                              {serviceTypeConfig[type].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        min="0"
                        placeholder="Qtd"
                        className="w-20"
                        value={service.quantity || ""}
                        onChange={(e) => updateService(activeRoom.id, service.id, { quantity: Number(e.target.value) })}
                      />

                      <span className="text-sm text-muted-foreground">x</span>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 pl-7"
                          value={service.unitPrice || ""}
                          onChange={(e) => updateService(activeRoom.id, service.id, { unitPrice: Number(e.target.value) })}
                        />
                      </div>

                      <span className="text-sm text-muted-foreground">
                        = ${(service.quantity * service.unitPrice).toFixed(2)}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(activeRoom.id, service.id)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Materials (construction only) */}
            {businessType === "construction" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="size-4" />
                    <h4 className="font-medium">Materiais</h4>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => addMaterial(activeRoom.id)}>
                    <PlusIcon className="mr-2 size-4" />
                    Adicionar
                  </Button>
                </div>

                {activeRoom.materials.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum material adicionado.</p>
                ) : (
                  <div className="space-y-3">
                    {activeRoom.materials.map((material) => (
                      <div key={material.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Input
                          placeholder="Nome do material"
                          className="flex-1"
                          value={material.name}
                          onChange={(e) => updateMaterial(activeRoom.id, material.id, { name: e.target.value })}
                        />

                        <Input
                          type="number"
                          min="0"
                          placeholder="Qtd"
                          className="w-20"
                          value={material.quantity || ""}
                          onChange={(e) => updateMaterial(activeRoom.id, material.id, { quantity: Number(e.target.value) })}
                        />

                        <span className="text-sm text-muted-foreground">x</span>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 pl-7"
                            value={material.unitPrice || ""}
                            onChange={(e) => updateMaterial(activeRoom.id, material.id, { unitPrice: Number(e.target.value) })}
                          />
                        </div>

                        <span className="text-sm text-muted-foreground">
                          = ${(material.quantity * material.unitPrice).toFixed(2)}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(activeRoom.id, material.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Labor & Helpers */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Mao de Obra</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Horas de Trabalho</Label>
              <Input
                type="number"
                min="0"
                value={estimate.laborHours || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, laborHours: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor/Hora ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={estimate.laborRate || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, laborRate: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ajudantes</Label>
              <Input
                type="number"
                min="0"
                value={estimate.helpers || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, helpers: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor/Hora Ajudante ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={estimate.helperRate || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, helperRate: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Observacoes</h3>
          <Textarea
            placeholder="Adicione observacoes ou condicoes especiais..."
            rows={4}
            value={estimate.notes}
            onChange={(e) => setEstimate(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="space-y-6">
        <div className="sticky top-6 rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <CalculatorIcon className="size-5" />
            <h3 className="font-semibold">Resumo</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicos</span>
              <span>${summary.servicesTotal.toFixed(2)}</span>
            </div>
            {businessType === "construction" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materiais</span>
                <span>${summary.materialsTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mao de Obra</span>
              <span>${summary.laborTotal.toFixed(2)}</span>
            </div>
            {estimate.helpers > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ajudantes</span>
                <span>${summary.helpersTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="my-3 h-px bg-border" />

            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${summary.subtotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Desconto (%)</span>
              <Input
                type="number"
                min="0"
                max="100"
                className="w-20 text-right"
                value={estimate.discount || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, discount: Number(e.target.value) }))}
              />
            </div>
            {summary.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-${summary.discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Tax */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Imposto (%)</span>
              <Input
                type="number"
                min="0"
                max="100"
                className="w-20 text-right"
                value={estimate.taxRate || ""}
                onChange={(e) => setEstimate(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
              />
            </div>
            {summary.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Imposto</span>
                <span>${summary.taxAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="my-3 h-px bg-border" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button className="w-full" onClick={() => onSave(estimate)}>
              Salvar Orcamento
            </Button>
            <Button variant="outline" className="w-full">
              Visualizar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
