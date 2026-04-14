import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string
      deliveryPersonId?: string
    }

    if (!body.orderId || !body.deliveryPersonId) {
      return NextResponse.json({ ok: false, error: 'orderId y deliveryPersonId son requeridos' }, { status: 400 })
    }

    const db = await getDatabase()
    const pedidosCollection = db.collection('pedidos') as any

    const result = await pedidosCollection.updateOne(
      { _id: body.orderId },
      {
        $set: {
          estado: 'en camino',
          'entrega.id_repartidor': body.deliveryPersonId,
          'entrega.estado': 'en camino',
        },
      }
    )

    if (!result.matchedCount) {
      return NextResponse.json({ ok: false, error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/deliveries/assign error:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo asignar repartidor' }, { status: 500 })
  }
}
