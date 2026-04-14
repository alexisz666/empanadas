import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { mockDashboardMetrics } from '@/data/mock-data'

export async function GET() {
  try {
    const db = await getDatabase()
    const pedidosCollection = db.collection('pedidos') as any
    const usuariosCollection = db.collection('usuarios') as any

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const orders = (await pedidosCollection.find({}).toArray()) as Array<Record<string, unknown>>

    const withDate = orders.map((order) => ({
      ...order,
      date: new Date(String(order.fecha_pedido ?? now.toISOString())),
      total: Number(order.total ?? 0),
      items: Array.isArray(order.productos) ? order.productos : [],
    }))

    const ordersToday = withDate.filter((order) => order.date >= startOfToday)
    const ordersMonth = withDate.filter((order) => order.date >= startOfMonth)
    const ordersYear = withDate.filter((order) => order.date >= startOfYear)

    const sumTotal = (list: Array<{ total: number }>) => list.reduce((sum, order) => sum + order.total, 0)
    const sumEmpanadas = (list: Array<{ items: unknown[] }>) =>
      list.reduce((sum, order) => {
        const items = order.items as Array<Record<string, unknown>>
        return sum + items.reduce((acc, item) => acc + Number(item.cantidad ?? 0), 0)
      }, 0)

    const totalClients = await usuariosCollection.countDocuments({ activo: true })
    const pendingOrders = await pedidosCollection.countDocuments({ estado: { $in: ['pendiente', 'en preparación', 'en camino'] } })

    const salesMonth = sumTotal(ordersMonth)
    const ordersMonthCount = ordersMonth.length || 1

    return NextResponse.json({
      salesToday: sumTotal(ordersToday),
      salesMonth,
      salesYear: sumTotal(ordersYear),
      ordersToday: ordersToday.length,
      ordersMonth: ordersMonth.length,
      ordersYear: ordersYear.length,
      averageOrderValue: Math.round(salesMonth / ordersMonthCount),
      empanadasSoldToday: sumEmpanadas(ordersToday),
      empanadasSoldMonth: sumEmpanadas(ordersMonth),
      empanadasSoldYear: sumEmpanadas(ordersYear),
      totalClients,
      newClientsMonth: 0,
      pendingOrders,
      averageDeliveryTime: 0,
    })
  } catch (error) {
    console.error('GET /api/dashboard/metrics error:', error)
    return NextResponse.json(mockDashboardMetrics)
  }
}
