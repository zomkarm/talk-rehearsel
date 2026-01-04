import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!subscription) {
      return NextResponse.json({ status: 'FREE' })
    }

    return NextResponse.json({
      status: subscription.status,
      planTitle: subscription.planTitle,
      currentPeriodEnd: subscription.currentPeriodEnd,
      payments: subscription.payments,
    })
  } catch (err) {
    console.error('Subscription API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
