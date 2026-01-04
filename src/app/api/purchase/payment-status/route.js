import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(req) {
  console.log("checking ststusss")
  try {
    const { searchParams } = new URL(req.url)
    const subId = searchParams.get('sub')

    if (!subId) {
      return NextResponse.json({ error: 'Missing subscription id' }, { status: 400 })
    }

    // Find subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    console.log(subscription)
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Default status
    let status = subscription.status || 'INCOMPLETE'

    // If we have a payment, use its status
    if (subscription.payments.length > 0) {
      status = subscription.payments[0].status
    }
    console.log("payment status :", status)
    return NextResponse.json({
      subscriptionId: subscription.id,
      paymentStatus: status,
    })
  } catch (err) {
    console.error('Payment status API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
