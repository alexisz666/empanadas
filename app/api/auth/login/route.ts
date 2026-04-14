import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

type LoginBody = {
  role: 'admin' | 'delivery'
  username?: string
  password?: string
  repartidorId?: string
  phone?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody

  if (body.role === 'admin') {
    if (!body.username || !body.password) {
      return NextResponse.json({ ok: false, error: 'Ingresa usuario y contraseña' }, { status: 400 })
    }

    const db = await getDatabase()
    const usuariosCollection = db.collection('usuarios') as any
    const user = await usuariosCollection.findOne({ _id: body.username })

    if (!user || user.activo !== true) {
      return NextResponse.json({ ok: false, error: 'Credenciales de admin inválidas' }, { status: 401 })
    }

    const allowedPasswords = [
      typeof user.password === 'string' ? user.password : '',
      typeof user.contrasena === 'string' ? user.contrasena : '',
      typeof user.pin === 'string' ? user.pin : '',
      typeof user.nombre === 'string' ? user.nombre : '',
      String(user._id ?? ''),
    ].filter(Boolean)

    if (!allowedPasswords.includes(body.password)) {
      return NextResponse.json({ ok: false, error: 'Credenciales de admin inválidas' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, role: 'admin' })
    response.cookies.set('app_role', 'admin', { httpOnly: true, sameSite: 'lax', path: '/' })
    response.cookies.set('app_user_id', String(user._id), { httpOnly: true, sameSite: 'lax', path: '/' })
    response.cookies.set(
      'app_user_name',
      typeof user.nombre === 'string' ? user.nombre : String(user._id),
      { httpOnly: true, sameSite: 'lax', path: '/' }
    )
    return response
  }

  if (body.role === 'delivery') {
    if (!body.repartidorId || !body.phone) {
      return NextResponse.json(
        { ok: false, error: 'Ingresa ID y teléfono del repartidor' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const repartidoresCollection = db.collection('repartidores') as any
    const repartidor = await repartidoresCollection.findOne({ _id: body.repartidorId })

    if (!repartidor || repartidor.activo !== true || repartidor.telefono !== body.phone) {
      return NextResponse.json({ ok: false, error: 'Credenciales de repartidor inválidas' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, role: 'delivery' })
    response.cookies.set('app_role', 'delivery', { httpOnly: true, sameSite: 'lax', path: '/' })
    response.cookies.set('app_user_id', String(repartidor._id), { httpOnly: true, sameSite: 'lax', path: '/' })
    response.cookies.set(
      'app_user_name',
      typeof repartidor.nombre === 'string' ? repartidor.nombre : 'Repartidor',
      { httpOnly: true, sameSite: 'lax', path: '/' }
    )
    return response
  }

  return NextResponse.json({ ok: false, error: 'Rol no soportado' }, { status: 400 })
}
