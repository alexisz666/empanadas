import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('app_role', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  response.cookies.set('app_user_id', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  response.cookies.set('app_user_name', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
