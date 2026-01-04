import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma/client'
import { createToken } from '@/lib/auth' // your JWT or session helper

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = createToken({ id: admin.id, type: admin.type })

    const res = NextResponse.json({ message: 'Signin successful' })
    res.cookies.set('admin_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    })
    return res
  } catch (err) {
    console.error('Signin error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
