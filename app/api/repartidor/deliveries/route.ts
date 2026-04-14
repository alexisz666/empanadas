import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

type DeliveryOrder = {
  id: string
  clientName: string
  address: string
  total: number
  status: string
  createdAt: string
  assignedTo: string
}

function normalizeStatus(value: unknown): 'pendiente' | 'en camino' | 'entregado' {
  const status = String(value ?? '').toLowerCase()
  if (status.includes('entregado')) return 'entregado'
  if (status.includes('camino') || status.includes('ruta') || status.includes('asignado')) return 'en camino'
  return 'pendiente'
}

function mapOrder(
  doc: Record<string, unknown>,
  clientName: string,
  currentDeliveryUserId: string
): DeliveryOrder {
  const entrega = (doc.entrega as Record<string, unknown>) || {}
  const assignedTo = String(entrega.id_repartidor ?? '')
  const normalized = normalizeStatus(doc.estado ?? entrega.estado)

  return {
    id: String(doc._id ?? ''),
    clientName,
    address: String(doc.direccion ?? 'Sin dirección'),
    total: Number(doc.total ?? 0),
    status: normalized,
    createdAt: String(doc.fecha_pedido ?? new Date().toISOString()),
    assignedTo: assignedTo || currentDeliveryUserId,
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('app_user_id')?.value
  const role = cookieStore.get('app_role')?.value

  if (!userId || role !== 'delivery') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
  }

  const db = await getDatabase()
  const pedidosCollection = db.collection('pedidos') as any
  const usersCollection = db.collection('usuarios') as any

  const orders = (await pedidosCollection
    .find({})
    .sort({ fecha_pedido: -1 })
    .toArray()) as Array<Record<string, unknown>>

  const userIds = [...new Set(orders.map((order) => String(order.id_usuario ?? '')))].filter(Boolean)
  const users = (await usersCollection.find({ _id: { $in: userIds } }).toArray()) as Array<Record<string, unknown>>

  const usersMap = new Map<string, string>(
    users.map((user) => [String(user._id), String(user.nombre ?? 'Cliente')])
  )
  const mapped = orders.map((order) =>
    mapOrder(order, usersMap.get(String(order.id_usuario ?? '')) || 'Cliente', userId)
  )

  const pending = mapped.filter((order) => order.status === 'pendiente')
  const inRoute = mapped.filter((order) => order.status === 'en camino')
  const completed = mapped.filter((order) => order.status === 'entregado')

  return NextResponse.json({ pending, inRoute, completed })
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('app_user_id')?.value
  const role = cookieStore.get('app_role')?.value

  if (!userId || role !== 'delivery') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
  }

  const body = (await request.json()) as { orderId?: string }
  if (!body.orderId) {
    return NextResponse.json({ ok: false, error: 'orderId es requerido' }, { status: 400 })
  }

  const db = await getDatabase()
  const pedidosCollection = db.collection('pedidos') as any
  const currentOrder = (await pedidosCollection.findOne({ _id: body.orderId })) as
    | Record<string, unknown>
    | null

  if (!currentOrder) {
    return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 })
  }

  const currentDelivery = (currentOrder.entrega as Record<string, unknown>) || {}
  const assignedTo = String(currentDelivery.id_repartidor ?? '')

  if (assignedTo && assignedTo !== userId) {
    return NextResponse.json({ ok: false, error: 'Pedido asignado a otro repartidor' }, { status: 403 })
  }

  const result = await pedidosCollection.updateOne(
    { _id: body.orderId },
    {
      $set: {
        estado: 'entregado',
        'entrega.id_repartidor': userId,
        'entrega.estado': 'entregado',
        'entrega.fecha_entrega': new Date().toISOString(),
      },
    }
  )

  if (!result.matchedCount) {
    return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
