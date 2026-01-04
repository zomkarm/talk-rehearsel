import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getSetting } from '@/lib/settings'

export async function GET() {
  try {
    const plans = await prisma.pricing.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }, // or use sortOrder if you add one
    })

    const payment_provider = await getSetting('PAYMENT_PROVIDER') 
    const lsMode = await getSetting('LEMONSQUEEZY_MODE') 

    return NextResponse.json({ plans, provider:payment_provider, lsMode:lsMode })
  } catch (err) {
    console.error('Pricing GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
