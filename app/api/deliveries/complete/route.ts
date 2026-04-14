import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderId?: string; code?: string }
    if (!body.orderId) {
      return NextResponse.json({ ok: false, error: 'orderId es requerido' }, { status: 400 })
    }

    const db = await getDatabase()
    const pedidosCollection = db.collection('pedidos') as any

    const result = await pedidosCollection.updateOne(
      { _id: body.orderId },
      {
        $set: {
          estado: 'entregado',
          'entrega.estado': 'entregado',
          'entrega.codigo_entrega': body.code || null,
          'entrega.fecha_entrega': new Date().toISOString(),
        },
      }
    )

    if (!result.matchedCount) {
      return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/deliveries/complete error:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo completar la entrega' }, { status: 500 })
  }
}
