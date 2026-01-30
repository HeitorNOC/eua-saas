import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PaginationProps = {
  page: number
  totalPages: number
  baseUrl: string
  pageSize?: number
  className?: string
}

export function Pagination({
  page,
  totalPages,
  baseUrl,
  pageSize = 10,
  className,
}: PaginationProps) {
  const prevPage = Math.max(1, page - 1)
  const nextPage = Math.min(totalPages, page + 1)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  const buildUrl = (targetPage: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}page=${targetPage}&pageSize=${pageSize}`
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-muted-foreground text-sm tabular-nums">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {hasPrev ? (
          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Link href={buildUrl(prevPage)} aria-label="Pagina anterior">
              <ChevronLeftIcon className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
            aria-label="Pagina anterior"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
        )}
        {hasNext ? (
          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Link href={buildUrl(nextPage)} aria-label="Proxima pagina">
              <ChevronRightIcon className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
            aria-label="Proxima pagina"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
