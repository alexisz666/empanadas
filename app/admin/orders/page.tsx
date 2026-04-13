'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
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
import { getOrders, updateOrderStatus } from '@/services/api'
import type { Order } from '@/data/mock-data'
import {
  ShoppingCart,
  Clock,
  ChefHat,
  CheckCircle,
  Truck,
  Eye,
} from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'ready', label: 'Listo' },
  { value: 'delivering', label: 'En ruta' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const typeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'event', label: 'Evento' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  async function loadOrders() {
    setIsLoading(true)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesType = typeFilter === 'all' || order.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const preparingCount = orders.filter((o) => o.status === 'preparing').length
  const readyCount = orders.filter((o) => o.status === 'ready').length
  const deliveringCount = orders.filter((o) => o.status === 'delivering').length

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Pedido',
      render: (order) => (
        <div>
          <p className="font-medium text-foreground">#{order.id.slice(-4)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ),
    },
    {
      key: 'clientName',
      header: 'Cliente',
      render: (order) => (
        <div>
          <p className="font-medium">{order.clientName}</p>
          <p className="text-xs text-muted-foreground">{order.clientPhone}</p>
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
      key: 'items',
      header: 'Items',
      render: (order) => (
        <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} uds</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (order) => (
        <div>
          <span className="font-semibold">${order.total.toLocaleString()}</span>
          {!order.isPaid && (
            <Badge variant="outline" className="ml-2 text-xs">
              Pendiente
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'deliveryMethod',
      header: 'Entrega',
      render: (order) => (
        <Badge variant="secondary">
          {order.deliveryMethod === 'delivery' ? 'Envío' : 'Recoger'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedOrder(order)
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
        title="Pedidos"
        description="Gestiona todos los pedidos del negocio"
        icon={ShoppingCart}
        onRefresh={loadOrders}
        isRefreshing={isLoading}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pendientes"
          value={pendingCount}
          icon={Clock}
          isLoading={isLoading}
        />
        <StatCard
          title="Preparando"
          value={preparingCount}
          icon={ChefHat}
          isLoading={isLoading}
        />
        <StatCard
          title="Listos"
          value={readyCount}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="En Ruta"
          value={deliveringCount}
          icon={Truck}
          isLoading={isLoading}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por cliente o ID..."
              className="sm:w-64"
            />
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Estado"
              className="sm:w-40"
            />
            <FilterSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              placeholder="Tipo"
              className="sm:w-40"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredOrders}
            isLoading={isLoading}
            emptyMessage="No hay pedidos"
            emptyDescription="No se encontraron pedidos con los filtros aplicados."
            rowClassName={(order) => (order.isUrgent ? 'bg-red-50/50' : '')}
          />
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Pedido #{selectedOrder?.id.slice(-4)}
              {selectedOrder?.isUrgent && (
                <Badge className="ml-2 bg-red-100 text-red-800">Urgente</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.clientPhone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entrega</p>
                  <p className="font-medium">
                    {selectedOrder.deliveryMethod === 'delivery'
                      ? 'Envío a domicilio'
                      : 'Recoger en local'}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Productos
                </p>
                <div className="rounded-lg border">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b p-3 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.unitPrice}
                        </p>
                      </div>
                      <p className="font-semibold">${item.subtotal}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-muted/50 p-3">
                    <p className="font-semibold">Total</p>
                    <p className="text-xl font-bold text-primary">
                      ${selectedOrder.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Notes */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Pago</p>
                  <p className="font-medium capitalize">
                    {selectedOrder.paymentMethod === 'cash'
                      ? 'Efectivo'
                      : selectedOrder.paymentMethod === 'card'
                      ? 'Tarjeta'
                      : 'Transferencia'}
                  </p>
                  <Badge
                    variant={selectedOrder.isPaid ? 'default' : 'outline'}
                    className="mt-1"
                  >
                    {selectedOrder.isPaid ? 'Pagado' : 'Pendiente de pago'}
                  </Badge>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notas</p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Cambiar Estado
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status.value}
                      variant={
                        selectedOrder.status === status.value
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          selectedOrder.id,
                          status.value as Order['status']
                        )
                      }
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
