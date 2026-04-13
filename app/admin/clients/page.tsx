'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { SearchInput } from '@/components/shared/search-input'
import { FilterSelect } from '@/components/shared/filter-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getClients } from '@/services/api'
import type { Client } from '@/data/mock-data'
import { Users, UserPlus, Crown, Eye, Phone, Mail, MapPin } from 'lucide-react'

const frequentOptions = [
  { value: 'frequent', label: 'Frecuentes' },
  { value: 'regular', label: 'Regulares' },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [frequentFilter, setFrequentFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  async function loadClients() {
    setIsLoading(true)
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
    const matchesFrequent =
      frequentFilter === 'all' ||
      (frequentFilter === 'frequent' && client.isFrequent) ||
      (frequentFilter === 'regular' && !client.isFrequent)
    return matchesSearch && matchesFrequent
  })

  const totalClients = clients.length
  const frequentClients = clients.filter((c) => c.isFrequent).length
  const newClientsMonth = clients.filter((c) => {
    const createdAt = new Date(c.createdAt)
    const now = new Date()
    return (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    )
  }).length
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0)

  const columns: Column<Client>[] = [
    {
      key: 'name',
      header: 'Cliente',
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{client.name}</p>
              {client.isFrequent && (
                <Crown className="h-4 w-4 text-amber-500" />
              )}
            </div>
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
      key: 'lastOrderDate',
      header: 'Última Compra',
      render: (client) => (
        <span className="text-muted-foreground">
          {new Date(client.lastOrderDate).toLocaleDateString('es-MX')}
        </span>
      ),
    },
    {
      key: 'isFrequent',
      header: 'Estado',
      render: (client) =>
        client.isFrequent ? (
          <Badge className="bg-amber-100 text-amber-800">
            <Crown className="mr-1 h-3 w-3" />
            VIP
          </Badge>
        ) : (
          <Badge variant="secondary">Regular</Badge>
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (client) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedClient(client)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestión de clientes del negocio"
        icon={Users}
        onRefresh={loadClients}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clientes"
          value={totalClients}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Clientes VIP"
          value={frequentClients}
          icon={Crown}
          description={`${Math.round((frequentClients / totalClients) * 100)}% del total`}
          isLoading={isLoading}
        />
        <StatCard
          title="Nuevos Este Mes"
          value={newClientsMonth}
          icon={UserPlus}
          trend={{ value: 12, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${totalRevenue.toLocaleString()}`}
          isLoading={isLoading}
        />
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nombre o teléfono..."
              className="sm:w-64"
            />
            <FilterSelect
              value={frequentFilter}
              onChange={setFrequentFilter}
              options={frequentOptions}
              placeholder="Tipo de cliente"
              className="sm:w-48"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredClients}
            isLoading={isLoading}
            emptyMessage="No hay clientes"
            emptyDescription="No se encontraron clientes con los filtros aplicados."
          />
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedClient?.name}
              {selectedClient?.isFrequent && (
                <Badge className="bg-amber-100 text-amber-800">
                  <Crown className="mr-1 h-3 w-3" />
                  VIP
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient.phone}</span>
                </div>
                {selectedClient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.address}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedClient.totalOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">Pedidos totales</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    ${selectedClient.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total gastado</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente desde</p>
                  <p className="font-medium">
                    {new Date(selectedClient.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última compra</p>
                  <p className="font-medium">
                    {new Date(selectedClient.lastOrderDate).toLocaleDateString(
                      'es-MX'
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Ver historial
                </Button>
                <Button className="flex-1">Enviar mensaje</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
