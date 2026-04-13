'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  getDeliveryData,
  completeDelivery,
  assignDeliveryPerson,
} from '@/services/api'
import type { Order, DeliveryPerson } from '@/data/mock-data'
import {
  Truck,
  Package,
  CheckCircle,
  MapPin,
  Timer,
  QrCode,
  Send,
  User,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function DeliveriesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingDeliveries, setPendingDeliveries] = useState<Order[]>([])
  const [inRouteDeliveries, setInRouteDeliveries] = useState<Order[]>([])
  const [completedDeliveries, setCompletedDeliveries] = useState<Order[]>([])
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [confirmationCode, setConfirmationCode] = useState('')

  async function loadData() {
    setIsLoading(true)
    try {
      const data = await getDeliveryData()
      setPendingDeliveries(data.pendingDeliveries)
      setInRouteDeliveries(data.inRouteDeliveries)
      setCompletedDeliveries(data.completedDeliveries)
      setDeliveryPersons(data.deliveryPersons)
    } catch (error) {
      console.error('Error loading delivery data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCompleteDelivery(orderId: string) {
    try {
      await completeDelivery(orderId, confirmationCode)
      // Move from in-route to completed
      const order = inRouteDeliveries.find((o) => o.id === orderId)
      if (order) {
        setInRouteDeliveries((prev) => prev.filter((o) => o.id !== orderId))
        setCompletedDeliveries((prev) => [
          { ...order, status: 'delivered' },
          ...prev,
        ])
      }
      setSelectedOrder(null)
      setConfirmationCode('')
    } catch (error) {
      console.error('Error completing delivery:', error)
    }
  }

  async function handleAssignDelivery(orderId: string, deliveryPersonId: string) {
    try {
      await assignDeliveryPerson(orderId, deliveryPersonId)
      const order = pendingDeliveries.find((o) => o.id === orderId)
      if (order) {
        setPendingDeliveries((prev) => prev.filter((o) => o.id !== orderId))
        setInRouteDeliveries((prev) => [
          { ...order, status: 'delivering', deliveryPersonId },
          ...prev,
        ])
      }
    } catch (error) {
      console.error('Error assigning delivery:', error)
    }
  }

  const avgDeliveryTime =
    deliveryPersons.reduce((sum, dp) => sum + dp.averageDeliveryTime, 0) /
    (deliveryPersons.length || 1)

  const deliveryPersonColumns: Column<DeliveryPerson>[] = [
    {
      key: 'name',
      header: 'Repartidor',
      render: (dp) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{dp.name}</p>
            <p className="text-xs text-muted-foreground">{dp.phone}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (dp) => (
        <Badge
          variant={dp.isActive ? 'default' : 'secondary'}
          className={dp.isActive ? 'bg-emerald-100 text-emerald-800' : ''}
        >
          {dp.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'currentOrders',
      header: 'Pedidos Actuales',
      render: (dp) => <span className="font-medium">{dp.currentOrders}</span>,
    },
    {
      key: 'totalDeliveries',
      header: 'Total Entregas',
      render: (dp) => <span>{dp.totalDeliveries.toLocaleString()}</span>,
    },
    {
      key: 'averageDeliveryTime',
      header: 'Tiempo Promedio',
      render: (dp) => <span>{dp.averageDeliveryTime} min</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entregas"
        description="Gestión de entregas y repartidores"
        icon={Truck}
        onRefresh={loadData}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Por Entregar"
          value={pendingDeliveries.length}
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="En Ruta"
          value={inRouteDeliveries.length}
          icon={Truck}
          isLoading={isLoading}
        />
        <StatCard
          title="Completadas Hoy"
          value={completedDeliveries.length}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Tiempo Promedio"
          value={`${Math.round(avgDeliveryTime)} min`}
          icon={Timer}
          isLoading={isLoading}
        />
      </div>

      {/* Delivery Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Deliveries */}
        <Card>
          <CardHeader className="border-b bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Package className="h-5 w-5" />
              Por Entregar ({pendingDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] space-y-4 overflow-y-auto p-4">
            {isLoading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : pendingDeliveries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay entregas pendientes
              </div>
            ) : (
              pendingDeliveries.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  deliveryPersons={deliveryPersons.filter((dp) => dp.isActive)}
                  onAssign={(dpId) => handleAssignDelivery(order.id, dpId)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* In Route Deliveries */}
        <Card>
          <CardHeader className="border-b bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Truck className="h-5 w-5" />
              En Ruta ({inRouteDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] space-y-4 overflow-y-auto p-4">
            {isLoading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : inRouteDeliveries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay entregas en ruta
              </div>
            ) : (
              inRouteDeliveries.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  deliveryPersons={deliveryPersons}
                  isInRoute
                  onComplete={() => setSelectedOrder(order)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Entregas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                Espacio reservado para mapa de rutas
              </p>
              <p className="text-sm text-muted-foreground">
                Integración futura con Google Maps o similar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Persons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Repartidores</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={deliveryPersonColumns}
            data={deliveryPersons}
            isLoading={isLoading}
            emptyMessage="No hay repartidores"
          />
        </CardContent>
      </Card>

      {/* Complete Delivery Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega #{selectedOrder?.id.slice(-4)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{selectedOrder?.clientName}</p>
              <p className="text-sm text-muted-foreground">
                {selectedOrder?.deliveryAddress}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">
                Código de confirmación (opcional)
              </label>
              <Input
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Ingrese código..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <QrCode className="mr-2 h-4 w-4" />
                Escanear QR
              </Button>
              <Button variant="outline" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Reenviar código
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                selectedOrder && handleCompleteDelivery(selectedOrder.id)
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Entrega
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DeliveryCardProps {
  order: Order
  deliveryPersons: DeliveryPerson[]
  isInRoute?: boolean
  onAssign?: (deliveryPersonId: string) => void
  onComplete?: () => void
}

function DeliveryCard({
  order,
  deliveryPersons,
  isInRoute,
  onAssign,
  onComplete,
}: DeliveryCardProps) {
  const assignedPerson = deliveryPersons.find(
    (dp) => dp.id === order.deliveryPersonId
  )

  return (
    <Card className={order.isUrgent ? 'border-red-300 bg-red-50/50' : ''}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">#{order.id.slice(-4)}</span>
              {order.isUrgent && (
                <Badge className="bg-red-100 text-red-800">Urgente</Badge>
              )}
            </div>
            <p className="text-sm font-medium">{order.clientName}</p>
            <p className="text-xs text-muted-foreground">{order.clientPhone}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mb-3 flex items-start gap-2 rounded-lg bg-muted/50 p-2">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{order.deliveryAddress}</p>
        </div>

        {assignedPerson && (
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{assignedPerson.name}</span>
          </div>
        )}

        {isInRoute ? (
          <Button className="w-full" onClick={onComplete}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Marcar Entregado
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {deliveryPersons.map((dp) => (
              <Button
                key={dp.id}
                variant="outline"
                size="sm"
                onClick={() => onAssign?.(dp.id)}
              >
                {dp.name}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
