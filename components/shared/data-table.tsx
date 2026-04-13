'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { AlertCircle, Inbox } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  error?: string
  onRowClick?: (item: T) => void
  rowClassName?: (item: T) => string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No hay datos',
  emptyDescription = 'No se encontraron registros para mostrar.',
  error,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-12">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">Error al cargar datos</h3>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 py-12">
        <Inbox className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">{emptyMessage}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-muted/50',
                rowClassName?.(item)
              )}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
