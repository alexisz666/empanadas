'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, CheckCircle2, LogOut, MapPin, Clock } from 'lucide-react'

type DeliveryOrder = {
  id: string
  clientName: string
  address: string
  total: number
  status: string
  createdAt: string
  assignedTo: string
}

type DeliveryResponse = {
  pending: DeliveryOrder[]
  inRoute: DeliveryOrder[]
  completed: DeliveryOrder[]
}

export default function RepartidorPage() {
  const router = useRouter()
  const [pendingOrders, setPendingOrders] = useState<DeliveryOrder[]>([])
  const [inRouteOrders, setInRouteOrders] = useState<DeliveryOrder[]>([])
  const [completedOrders, setCompletedOrders] = useState<DeliveryOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadOrders() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/repartidor/deliveries', { cache: 'no-store' })
      const data = (await response.json()) as DeliveryResponse
      setPendingOrders(Array.isArray(data.pending) ? data.pending : [])
      setInRouteOrders(Array.isArray(data.inRoute) ? data.inRoute : [])
      setCompletedOrders(Array.isArray(data.completed) ? data.completed : [])
    } catch (error) {
      console.error('Error loading delivery orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleComplete(orderId: string) {
    try {
      const response = await fetch('/api/repartidor/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        return
      }

      loadOrders()
    } catch (error) {
      console.error('Error completing delivery:', error)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/repartidor/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Repartidor</h1>
            <p className="text-muted-foreground">Pedidos asignados para entrega</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadOrders}>
              Actualizar
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Pendientes ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="h-20 animate-pulse rounded bg-muted" />
            ) : pendingOrders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay pedidos pendientes.</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="rounded-lg border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Pedido {order.id}</p>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <p className="text-sm">Cliente: {order.clientName}</p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {order.address}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleString('es-MX')}
                      </p>
                      <p className="text-sm font-medium">Total: ${order.total}</p>
                    </div>

                    <Button onClick={() => handleComplete(order.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Entregar pedido
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              En camino ({inRouteOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="h-20 animate-pulse rounded bg-muted" />
            ) : inRouteOrders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay pedidos en camino.</p>
            ) : (
              inRouteOrders.map(order => (
                <div key={order.id} className="rounded-lg border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Pedido {order.id}</p>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <p className="text-sm">Cliente: {order.clientName}</p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {order.address}
                      </p>
                      <p className="text-sm font-medium">Total: ${order.total}</p>
                    </div>

                    <Button onClick={() => handleComplete(order.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Marcar entregado
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completados ({completedOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="h-20 animate-pulse rounded bg-muted" />
            ) : completedOrders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay pedidos completados.</p>
            ) : (
              completedOrders.map(order => (
                <div key={order.id} className="rounded-lg border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">Pedido {order.id} - {order.clientName}</p>
                    <Badge className="bg-emerald-100 text-emerald-800">Entregado</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{order.address}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
