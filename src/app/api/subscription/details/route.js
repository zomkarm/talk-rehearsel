// src/app/api/subscription/details/route.js
import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ subscriptions })
  } catch (err) {
    console.error('Subscription details API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
