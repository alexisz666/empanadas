import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get('app_role')?.value

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname.startsWith('/repartidor') && pathname !== '/repartidor/login') {
    if (role !== 'delivery') {
      return NextResponse.redirect(new URL('/repartidor/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/repartidor/:path*'],
}
