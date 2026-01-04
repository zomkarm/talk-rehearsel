import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma/client';
import { createToken } from '../../../lib/auth'
import { validateSignup } from '../../../lib/validations/validateUser'

export async function POST(req) {
  try {
    const body = await req.json()
    const errors = validateSignup(body)
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 400 })

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (existingUser)
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

    const hashedPassword = await bcrypt.hash(body.password, 10)
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name || '', // optional field
      },
    })

    const token = createToken(newUser)

    const response = NextResponse.json({ message: 'Signup successful' })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 3600,
    })

    console.log('Setting cookie:', token)
    return response
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
