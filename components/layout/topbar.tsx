import { BellIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function Topbar() {
  return (
    <header className="border-b bg-background/80 px-6 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <InputGroup className="max-w-md">
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Buscar por jobs, clientes, equipes..." />
          </InputGroup>
        </div>
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <BellIcon className="size-4" />
        </Button>
      </div>
    </header>
  )
}
