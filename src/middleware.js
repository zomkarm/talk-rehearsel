import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Simple in-memory rate limiter (per IP)
const rateLimitStore = new Map()
const RATE_LIMIT = 100
const WINDOW_MS = 60 * 1000

export async function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'local'

  // --- Rate limiting ---
  const now = Date.now()
  const entry = rateLimitStore.get(ip) || { count: 0, start: now }
  if (now - entry.start < WINDOW_MS) {
    if (entry.count >= RATE_LIMIT) {
      return new NextResponse('Too many requests', { status: 429 })
    }
    entry.count++
  } else {
    entry.count = 1
    entry.start = now
  }
  rateLimitStore.set(ip, entry)

  const url = new URL(request.url)
  const path = url.pathname

  // --- USER ROUTES ---
  const userToken = request.cookies.get('auth_token')?.value
  const isUserAuthPage = path === '/login' || path === '/signup'

  if (isUserAuthPage && userToken) {
    try {
      await jwtVerify(userToken, new TextEncoder().encode(process.env.JWT_SECRET));
      // If token is valid, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // If token invalid, let them stay on login/signup
      return NextResponse.next();
    }
  }

  if (path.startsWith('/dashboard') || path.startsWith('/recordings') || path.startsWith('/project') || path.startsWith('/unscripted-practice') || path.startsWith('/settings')) {
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jwtVerify(userToken, new TextEncoder().encode(process.env.JWT_SECRET))
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // --- ADMIN ROUTES ---
  const adminToken = request.cookies.get('admin_auth_token')?.value
  const isAdminAuthPage = path === '/auth/admin/signin'

  if (path === '/auth/admin/signin' && adminToken) {
    try {
      await jwtVerify(adminToken, new TextEncoder().encode(process.env.JWT_SECRET))
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } catch {
      return NextResponse.next()
    }
  }


  if (path.startsWith('/admin') && !isAdminAuthPage) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/auth/admin/signin', request.url))
    }
    try {
      await jwtVerify(adminToken, new TextEncoder().encode(process.env.JWT_SECRET))
    } catch {
      return NextResponse.redirect(new URL('/auth/admin/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/unscripted-practice',
    '/recordings',
    '/settings',
    '/project/:path*',
    '/login',
    '/signup',
    '/admin/:path*',
    '/auth/admin/signin',
  ],
}
