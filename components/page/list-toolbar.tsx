import type { ReactNode } from "react"
import { FilterIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function ListToolbar({
  searchPlaceholder,
  filters,
  actions,
}: {
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-3">
        <InputGroup className="w-full max-w-sm">
          <InputGroupAddon>
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={searchPlaceholder ?? "Buscar"}
            aria-label={searchPlaceholder ?? "Buscar"}
          />
        </InputGroup>
        {filters ? (
          <div className="hidden items-center gap-2 lg:flex">
            <FilterIcon className="text-muted-foreground size-4" />
            {filters}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      {!actions ? (
        <Button variant="outline" size="sm" className="ml-auto">
          Exportar
        </Button>
      ) : null}
    </div>
  )
}
