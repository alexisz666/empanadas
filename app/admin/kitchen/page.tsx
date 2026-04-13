'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getKitchenQueue, markOrderReady } from '@/services/api'
import type { Order } from '@/data/mock-data'
import { ChefHat, Clock, CheckCircle, AlertTriangle, QrCode } from 'lucide-react'

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadOrders() {
    setIsLoading(true)
    try {
      const data = await getKitchenQueue()
      setOrders(data)
    } catch (error) {
      console.error('Error loading kitchen queue:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleMarkReady(orderId: string) {
    try {
      await markOrderReady(orderId)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'ready' as const } : o))
      )
    } catch (error) {
      console.error('Error marking order ready:', error)
    }
  }

  async function handleStartPreparing(orderId: string) {
    try {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'preparing' as const } : o
        )
      )
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const preparingOrders = orders.filter((o) => o.status === 'preparing')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Cocina"
          description="Cola de producción de pedidos"
          icon={ChefHat}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cocina"
        description="Cola de producción de pedidos"
        icon={ChefHat}
        onRefresh={loadOrders}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Cola</p>
              <p className="text-2xl font-bold">{pendingOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <ChefHat className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preparando</p>
              <p className="text-2xl font-bold">{preparingOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Empanadas</p>
              <p className="text-2xl font-bold">
                {orders.reduce(
                  (sum, o) =>
                    sum +
                    o.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
                  0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Orders */}
        <Card>
          <CardHeader className="border-b bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Clock className="h-5 w-5" />
              En Cola ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] space-y-4 overflow-y-auto p-4">
            {pendingOrders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay pedidos en cola
              </div>
            ) : (
              pendingOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onStartPreparing={() => handleStartPreparing(order.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Preparing Orders */}
        <Card>
          <CardHeader className="border-b bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <ChefHat className="h-5 w-5" />
              Preparando ({preparingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] space-y-4 overflow-y-auto p-4">
            {preparingOrders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay pedidos en preparación
              </div>
            ) : (
              preparingOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onMarkReady={() => handleMarkReady(order.id)}
                  isPreparing
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface KitchenOrderCardProps {
  order: Order
  onStartPreparing?: () => void
  onMarkReady?: () => void
  isPreparing?: boolean
}

function KitchenOrderCard({
  order,
  onStartPreparing,
  onMarkReady,
  isPreparing,
}: KitchenOrderCardProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className={`${order.isUrgent ? 'border-red-300 bg-red-50/50' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                #{order.id.slice(-4)}
              </span>
              {order.isUrgent && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Urgente
                </Badge>
              )}
              {order.type === 'event' && (
                <Badge variant="outline" className="border-primary text-primary">
                  Evento
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{order.clientName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{totalItems} empanadas</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 space-y-1 rounded-lg bg-muted/50 p-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.productName}</span>
              <span className="font-medium">x{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="mb-4 text-sm">
          <Badge variant="secondary">
            {order.deliveryMethod === 'delivery' ? 'Envío' : 'Recoger'}
          </Badge>
          {order.estimatedDeliveryTime && (
            <span className="ml-2 text-muted-foreground">
              Entregar:{' '}
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">
            {order.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isPreparing ? (
            <>
              <Button className="flex-1" onClick={onMarkReady}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar Listo
              </Button>
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button className="flex-1" variant="outline" onClick={onStartPreparing}>
              <ChefHat className="mr-2 h-4 w-4" />
              Iniciar Preparación
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
