"use client"

import * as React from "react"
import { ArrowDownUpIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export type ClientTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  accessor?: (row: T) => string | number | Date | null | undefined
  sortable?: boolean
  className?: string
  headerClassName?: string
}

type SortState = {
  id: string
  direction: "asc" | "desc"
} | null

export function DataTableClient<T>({
  columns,
  data,
  rowKey,
  pageSize = 8,
}: {
  columns: ClientTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string
  pageSize?: number
}) {
  const [sort, setSort] = React.useState<SortState>(null)
  const [page, setPage] = React.useState(1)

  const sorted = React.useMemo(() => {
    if (!sort) return data

    const column = columns.find((col) => col.id === sort.id)
    if (!column?.accessor) return data

    const sortedData = [...data].sort((a, b) => {
      const left = column.accessor?.(a)
      const right = column.accessor?.(b)

      if (left == null && right == null) return 0
      if (left == null) return -1
      if (right == null) return 1

      if (left instanceof Date && right instanceof Date) {
        return left.getTime() - right.getTime()
      }

      return String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base",
      })
    })

    return sort.direction === "asc" ? sortedData : sortedData.reverse()
  }, [columns, data, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const pageData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [currentPage, pageSize, sorted])

  const toggleSort = (column: ClientTableColumn<T>) => {
    if (!column.sortable) return

    setPage(1)
    setSort((prev) => {
      if (!prev || prev.id !== column.id) {
        return { id: column.id, direction: "asc" }
      }
      if (prev.direction === "asc") {
        return { id: column.id, direction: "desc" }
      }
      return null
    })
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.headerClassName}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-left"
                    onClick={() => toggleSort(column)}
                  >
                    {column.header}
                    <ArrowDownUpIcon className="size-3.5 opacity-70" />
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.id} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-muted-foreground text-sm">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
