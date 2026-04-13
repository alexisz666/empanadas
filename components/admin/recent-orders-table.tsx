'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import type { Order } from '@/data/mock-data'

interface RecentOrdersTableProps {
  orders: Order[]
  isLoading: boolean
}

export function RecentOrdersTable({ orders, isLoading }: RecentOrdersTableProps) {
  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Pedido',
      render: (order) => (
        <div>
          <p className="font-medium text-foreground">#{order.id.slice(-4)}</p>
          <p className="text-xs text-muted-foreground">{order.clientName}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (order) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={order.type === 'event' ? 'border-primary text-primary' : ''}
          >
            {order.type === 'event' ? 'Evento' : 'Individual'}
          </Badge>
          {order.isUrgent && (
            <Badge className="bg-red-100 text-red-800">Urgente</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (order) => (
        <span className="font-semibold">${order.total.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (order) => <StatusBadge status={order.status} />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="No hay pedidos"
          emptyDescription="No hay pedidos recientes."
          rowClassName={(order) =>
            order.isUrgent ? 'bg-red-50/50' : ''
          }
        />
      </CardContent>
    </Card>
  )
}
