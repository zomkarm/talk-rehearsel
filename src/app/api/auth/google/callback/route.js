import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { createToken } from '@/lib/auth'
import {getSetting} from '@/lib/settings'
import crypto from 'crypto'

function generateRandomPassword() {
  return crypto.randomBytes(32).toString('hex') // 64-char random string
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    if (!code) return NextResponse.redirect('/signup')

    const clientId = await getSetting('GOOGLE_CLIENT_ID')
    const clientSecret = await getSetting('GOOGLE_SECRET_KEY')

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Google auth not configured' }, { status: 500 })
    }

    const origin = await getSetting('APP_URL')
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.id_token) throw new Error('Missing ID token from Google')

    // Verify ID token
    const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenData.id_token}`)
    const userInfo = await userInfoRes.json()

    const email = userInfo.email
    const name = userInfo.name || ''
    const profile_pic = userInfo.picture || ''

    if (!email) {
      return NextResponse.json({ error: 'Google account missing email' }, { status: 400 })
    }

    // Upsert user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          profile_pic,
          password: generateRandomPassword(), // empty for Google users
          provider: 'google'
        },
      })
    }

    // Issue app token
    const token = createToken(user)

    const response = NextResponse.redirect('/dashboard')
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 3600,
    })

    return response
  } catch (err) {
    console.error('Google callback error:', err)
    return NextResponse.json({ error: 'Google sign-in failed' }, { status: 500 })
  }
}
