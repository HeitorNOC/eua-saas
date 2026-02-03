"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteAccountAction } from "@/actions/settings"

export function DangerZone() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [isOpen, setIsOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const handleDelete = () => {
    if (confirmText !== "EXCLUIR") {
      setError("Digite EXCLUIR para confirmar")
      return
    }
    
    setError(null)
    startTransition(async () => {
      const data = new FormData()
      data.append("confirmText", confirmText)
      
      const result = await deleteAccountAction({ success: false, error: null }, data)
      
      if (result.success) {
        setIsOpen(false)
        router.push("/")
        router.refresh()
      } else {
        setError(result.error || "Erro ao excluir conta")
      }
    })
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-medium">Excluir conta</h4>
          <p className="text-muted-foreground text-sm">
            Uma vez excluida, todos os dados serao perdidos permanentemente.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Excluir conta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="size-5 text-destructive" />
                Excluir conta permanentemente
              </DialogTitle>
              <DialogDescription>
                Esta acao nao pode ser desfeita. Todos os seus dados, incluindo
                clientes, jobs, pagamentos e configuracoes serao excluidos permanentemente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="rounded-md bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  <strong>Aviso:</strong> Voce perdera acesso a todos os dados da sua conta.
                  Essa acao e irreversivel.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmDelete">
                  Digite <span className="font-mono font-bold">EXCLUIR</span> para confirmar
                </Label>
                <Input
                  id="confirmDelete"
                  placeholder="EXCLUIR"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={isPending}
                />
              </div>
              
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setConfirmText("")
                  setError(null)
                }}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending || confirmText !== "EXCLUIR"}
              >
                {isPending ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir minha conta"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
