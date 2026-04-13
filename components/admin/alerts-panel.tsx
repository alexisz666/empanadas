'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Clock, Package } from 'lucide-react'
import type { InventoryItem } from '@/data/mock-data'

interface AlertsPanelProps {
  lowStockItems: InventoryItem[]
  pendingOrders: number
  isLoading: boolean
}

export function AlertsPanel({
  lowStockItems,
  pendingOrders,
  isLoading,
}: AlertsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-lg bg-muted" />
        <div className="h-20 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  const hasAlerts = lowStockItems.length > 0 || pendingOrders > 0

  if (!hasAlerts) {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pendingOrders > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Pedidos Pendientes</AlertTitle>
          <AlertDescription className="text-amber-700">
            Tienes {pendingOrders} pedido{pendingOrders > 1 ? 's' : ''} pendiente
            {pendingOrders > 1 ? 's' : ''} por preparar.
          </AlertDescription>
        </Alert>
      )}

      {lowStockItems.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Stock Bajo</AlertTitle>
          <AlertDescription className="text-red-700">
            {lowStockItems.length} insumo{lowStockItems.length > 1 ? 's' : ''} con
            stock bajo:{' '}
            {lowStockItems
              .slice(0, 3)
              .map((i) => i.name)
              .join(', ')}
            {lowStockItems.length > 3 && ` y ${lowStockItems.length - 3} más`}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
