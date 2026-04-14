import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { mockSalesChartData } from '@/data/mock-data'

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export async function GET() {
  try {
    const db = await getDatabase()
    const pedidosCollection = db.collection('pedidos') as any
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const orders = (await pedidosCollection.find({}).toArray()) as Array<Record<string, unknown>>
    const weekOrders = orders
      .map((order) => ({
        date: new Date(String(order.fecha_pedido ?? now.toISOString())),
        total: Number(order.total ?? 0),
        items: Array.isArray(order.productos) ? order.productos : [],
      }))
      .filter((order) => order.date >= start)

    const result = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)

      const dayOrders = weekOrders.filter(
        (order) =>
          order.date.getFullYear() === date.getFullYear() &&
          order.date.getMonth() === date.getMonth() &&
          order.date.getDate() === date.getDate()
      )

      const ventas = dayOrders.reduce((sum, order) => sum + order.total, 0)
      const empanadas = dayOrders.reduce((sum, order) => {
        return (
          sum +
          (order.items as Array<Record<string, unknown>>).reduce(
            (acc, item) => acc + Number(item.cantidad ?? 0),
            0
          )
        )
      }, 0)

      return {
        name: dayNames[date.getDay()],
        ventas,
        empanadas,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/dashboard/sales-chart error:', error)
    return NextResponse.json(mockSalesChartData)
  }
}
