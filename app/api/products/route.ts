import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'
import { mockProducts, type Product } from '@/data/mock-data'
import { mapProductDoc } from '@/lib/db-mappers'

type CreateProductBody = {
  name: string
  description?: string
  price: number
  category: Product['category']
  type?: Product['type']
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Number(limitParam) : undefined

  try {
    const db = await getDatabase()
    const query: Record<string, unknown> = {}

    if (category) {
      query.category = category as Product['category']
    }

    let dbItems = await db.collection('products').find(query).toArray()
    if (!dbItems.length) {
      dbItems = await db.collection('productos').find({}).toArray()
    }

    let items: Product[] = dbItems.map(item => mapProductDoc(item as Record<string, unknown>))
    if (category) {
      items = items.filter(item => item.category === category)
    }

    if (!items.length) {
      items = [...mockProducts]
      if (category) {
        items = items.filter(item => item.category === category)
      }
    }

    if (sort === 'top') {
      items = [...items].sort((a, b) => b.totalSold - a.totalSold)
    }

    if (limit && Number.isFinite(limit)) {
      items = items.slice(0, limit)
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/products error:', error)

    let fallback = [...mockProducts]
    if (category) {
      fallback = fallback.filter(item => item.category === category)
    }
    if (sort === 'top') {
      fallback = fallback.sort((a, b) => b.totalSold - a.totalSold)
    }
    if (limit && Number.isFinite(limit)) {
      fallback = fallback.slice(0, limit)
    }

    return NextResponse.json(fallback)
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const role = cookieStore.get('app_role')?.value
    if (role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
    }

    const body = (await request.json()) as CreateProductBody
    if (!body.name || !body.category || !Number.isFinite(body.price)) {
      return NextResponse.json({ ok: false, error: 'Datos inválidos del producto' }, { status: 400 })
    }

    const db = await getDatabase()
    const productId = `EMP${Date.now()}`

    const productDoc = {
      _id: productId,
      nombre: body.name,
      descripcion: body.description || 'Sin descripcion',
      precio: Number(body.price),
      category: body.category,
      type: body.type,
      activo: true,
      totalSold: 0,
      image: '/placeholder.jpg',
    }

    const productosCollection = db.collection('productos') as any
    await productosCollection.insertOne(productDoc)
    return NextResponse.json({ ok: true, product: mapProductDoc(productDoc) })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo crear el producto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const role = cookieStore.get('app_role')?.value
    if (role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'id es requerido' }, { status: 400 })
    }

    const db = await getDatabase()
    const productosCollection = db.collection('productos') as any
    const result = await productosCollection.deleteOne({ _id: id })

    if (!result.deletedCount) {
      return NextResponse.json({ ok: false, error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/products error:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo eliminar el producto' }, { status: 500 })
  }
}
