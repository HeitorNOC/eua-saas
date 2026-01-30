import { BellIcon, MenuIcon, SearchIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-5" />
        </Button>

        <div className="flex flex-1 items-center gap-4">
          <div className="hidden flex-1 md:block">
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <SearchIcon className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Buscar..."
                className="bg-muted/50 border-transparent focus:border-border"
              />
            </InputGroup>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Buscar"
          >
            <SearchIcon className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notificacoes"
          >
            <BellIcon className="size-5" />
            <span className="bg-destructive absolute right-1.5 top-1.5 size-2 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Menu do usuario"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="size-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuracoes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
