import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import {getSetting} from '@/lib/settings'

export async function GET() {
  try {
    const clientIdSetting = await getSetting('GOOGLE_CLIENT_ID') 
    if (!clientIdSetting) {
      return NextResponse.json({ error: 'Google client ID not configured' }, { status: 500 })
    }

    const origin = await getSetting('APP_URL')
    const redirectUri = `${origin}/api/auth/google/callback`
    const scope = encodeURIComponent('openid email profile')

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientIdSetting.value}&redirect_uri=${redirectUri}&scope=${scope}`

    return NextResponse.redirect(url)
  } catch (err) {
    console.error('Google auth redirect error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
