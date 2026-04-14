import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import {
  mockDeliveryPersons,
  mockOrders,
  type DeliveryPerson,
  type Order,
} from '@/data/mock-data'

type UserDoc = {
  _id?: string
  nombre?: string
  telefono?: string
}

type DeliveryDoc = {
  id_repartidor?: string
  estado?: string
}

type OrderDoc = {
  _id?: string
  id_usuario?: string
  productos?: Array<{
    id_producto?: string
    nombre?: string
    cantidad?: number
    precio?: number
  }>
  total?: number
  estado?: string
  direccion?: string
  fecha_pedido?: string
  entrega?: DeliveryDoc
}

type DeliveryPersonDoc = {
  _id?: string
  nombre?: string
  telefono?: string
  activo?: boolean
}

function normalizeOrderStatus(status: string): Order['status'] {
  const s = status.toLowerCase()
  if (s.includes('entregado')) return 'delivered'
  if (s.includes('camino') || s.includes('ruta')) return 'delivering'
  if (s.includes('listo') || s.includes('ready')) return 'ready'
  if (s.includes('prepar')) return 'preparing'
  if (s.includes('cancel')) return 'cancelled'
  return 'pending'
}

function mapOrders(orders: OrderDoc[], usersMap: Map<string, UserDoc>): Order[] {
  return orders.map((order) => {
    const user = usersMap.get(String(order.id_usuario ?? ''))
    const items = Array.isArray(order.productos) ? order.productos : []

    return {
      id: String(order._id ?? ''),
      clientId: String(order.id_usuario ?? ''),
      clientName: user?.nombre || 'Cliente',
      clientPhone: user?.telefono || String(order.id_usuario ?? ''),
      items: items.map((item) => ({
        productId: String(item.id_producto ?? ''),
        productName: item.nombre || 'Producto',
        quantity: Number(item.cantidad ?? 0),
        unitPrice: Number(item.precio ?? 0),
        subtotal: Number(item.cantidad ?? 0) * Number(item.precio ?? 0),
      })),
      total: Number(order.total ?? 0),
      status: normalizeOrderStatus(String(order.estado ?? order.entrega?.estado ?? 'pendiente')),
      type: 'individual',
      deliveryMethod: 'delivery',
      deliveryAddress: order.direccion || '',
      paymentMethod: 'cash',
      isPaid: true,
      isUrgent: false,
      createdAt: String(order.fecha_pedido ?? new Date().toISOString()),
      deliveryPersonId: order.entrega?.id_repartidor,
    }
  })
}

function mapDeliveryPersons(
  deliveryPersons: DeliveryPersonDoc[],
  orders: Order[]
): DeliveryPerson[] {
  return deliveryPersons.map((dp) => {
    const id = String(dp._id ?? '')
    const related = orders.filter((order) => order.deliveryPersonId === id)
    const currentOrders = related.filter((order) => order.status === 'delivering').length
    const totalDeliveries = related.filter((order) => order.status === 'delivered').length

    return {
      id,
      name: dp.nombre || 'Repartidor',
      phone: dp.telefono || '',
      isActive: dp.activo !== false,
      currentOrders,
      totalDeliveries,
      averageDeliveryTime: 30,
    }
  })
}

export async function GET() {
  try {
    const db = await getDatabase()
    const users = (await (db.collection('usuarios') as any).find({}).toArray()) as UserDoc[]
    const ordersRaw = (await (db.collection('pedidos') as any).find({}).toArray()) as OrderDoc[]
    const deliveryRaw = (await (db.collection('repartidores') as any).find({}).toArray()) as DeliveryPersonDoc[]

    const usersMap = new Map(users.map((user) => [String(user._id ?? ''), user]))
    const orders = mapOrders(ordersRaw, usersMap)
    const deliveryPersons = mapDeliveryPersons(deliveryRaw, orders)

    return NextResponse.json({
      pendingDeliveries: orders.filter((order) => order.status === 'pending' || order.status === 'ready'),
      inRouteDeliveries: orders.filter((order) => order.status === 'delivering'),
      completedDeliveries: orders.filter((order) => order.status === 'delivered'),
      deliveryPersons,
    })
  } catch (error) {
    console.error('GET /api/deliveries error:', error)

    const deliveryOrders = mockOrders.filter((order) => order.deliveryMethod === 'delivery')
    return NextResponse.json({
      pendingDeliveries: deliveryOrders.filter((order) => order.status === 'ready' || order.status === 'pending'),
      inRouteDeliveries: deliveryOrders.filter((order) => order.status === 'delivering'),
      completedDeliveries: deliveryOrders.filter((order) => order.status === 'delivered'),
      deliveryPersons: mockDeliveryPersons,
    })
  }
}
