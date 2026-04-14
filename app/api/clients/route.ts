import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { mockClients, type Client } from '@/data/mock-data'

type UserDoc = {
  _id?: string
  nombre?: string
  rol?: string
  tipo_usuario?: string
  telefono?: string
  email?: string
  direccion?: string
  activo?: boolean
  createdAt?: string
}

type OrderDoc = {
  id_usuario?: string
  total?: number
  fecha_pedido?: string
}

function mapClients(users: UserDoc[], orders: OrderDoc[]): Client[] {
  return users
    .filter((user) => user.activo !== false)
    .filter((user) => {
      const role = String(user.rol ?? user.tipo_usuario ?? '').toLowerCase()
      return role !== 'admin'
    })
    .map((user) => {
      const userId = String(user._id ?? '')
      const userOrders = orders.filter((order) => String(order.id_usuario ?? '') === userId)
      const totalOrders = userOrders.length
      const totalSpent = userOrders.reduce((sum, order) => sum + Number(order.total ?? 0), 0)
      const sortedDates = userOrders
        .map((order) => new Date(String(order.fecha_pedido ?? 0)).getTime())
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => b - a)

      return {
        id: userId,
        name: user.nombre || 'Cliente',
        phone: user.telefono || userId,
        email: user.email,
        address: user.direccion,
        totalOrders,
        totalSpent,
        lastOrderDate: sortedDates.length
          ? new Date(sortedDates[0]).toISOString()
          : new Date().toISOString(),
        isFrequent: totalOrders >= 3,
        createdAt: user.createdAt || new Date().toISOString(),
      } as Client
    })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const sort = searchParams.get('sort')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Number(limitParam) : undefined

  try {
    const db = await getDatabase()
    const users = (await (db.collection('usuarios') as any).find({}).toArray()) as UserDoc[]
    const orders = (await (db.collection('pedidos') as any).find({}).toArray()) as OrderDoc[]

    let clients = mapClients(users, orders)

    if (id) {
      const client = clients.find((item) => item.id === id) || null
      return NextResponse.json(client)
    }

    if (sort === 'top') {
      clients = clients.sort((a, b) => b.totalSpent - a.totalSpent)
    }

    if (limit && Number.isFinite(limit)) {
      clients = clients.slice(0, limit)
    }

    return NextResponse.json(clients)
  } catch (error) {
    console.error('GET /api/clients error:', error)

    if (id) {
      return NextResponse.json(mockClients.find((item) => item.id === id) || null)
    }

    let clients = [...mockClients]
    if (sort === 'top') {
      clients = clients.sort((a, b) => b.totalSpent - a.totalSpent)
    }
    if (limit && Number.isFinite(limit)) {
      clients = clients.slice(0, limit)
    }

    return NextResponse.json(clients)
  }
}
