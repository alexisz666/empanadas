'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import type { Client } from '@/data/mock-data'

interface TopClientsTableProps {
  clients: Client[]
  isLoading: boolean
}

export function TopClientsTable({ clients, isLoading }: TopClientsTableProps) {
  const columns: Column<Client>[] = [
    {
      key: 'name',
      header: 'Cliente',
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.phone}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Pedidos',
      render: (client) => (
        <span className="font-medium">{client.totalOrders}</span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Gastado',
      render: (client) => (
        <span className="font-semibold text-primary">
          ${client.totalSpent.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isFrequent',
      header: 'Estado',
      render: (client) =>
        client.isFrequent ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Frecuente
          </Badge>
        ) : (
          <Badge variant="secondary">Regular</Badge>
        ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={clients}
          isLoading={isLoading}
          emptyMessage="No hay clientes"
          emptyDescription="Aún no hay clientes registrados."
        />
      </CardContent>
    </Card>
  )
}
