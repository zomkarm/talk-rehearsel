import prisma from '@/lib/prisma/client';
import bcrypt from 'bcryptjs'
import { createToken, setAuthCookie } from '../../../lib/auth'
import { validateLogin } from '../../../lib/validations/validateUser'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const errors = validateLogin(body)
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (!user)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(body.password, user.password)
    if (!match)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = createToken(user)

    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 3600,
    })

    //console.log('Setting cookie:', token)
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
