import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { getSetting } from '@/lib/settings'
import prisma from '@/lib/prisma/client'

export async function POST(req) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { planId,variantId } = await req.json()
    const plan = await prisma.pricing.findFirst({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: 'Invalid planId' }, { status: 400 })
    }

    const origin = (await getSetting('APP_URL'))
    const provider = (await getSetting('PAYMENT_PROVIDER'))
    if(provider === 'None'){

        const subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            provider: 'None',
            planTitle: plan.title,
            planPrice: plan.price,
            planCurrency: plan.currency,
            planBillingCycle: plan.billingCycle,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            // For simulated annual/monthly, you can set a simple period end:
            currentPeriodEnd:
              plan.billingCycle === 'annual'
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                : plan.billingCycle === 'monthly'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : null,
          },
        })

        await prisma.payment.create({
          data: {
            subscriptionId: subscription.id,
            provider: 'None',
            providerPaymentId: `sim_${subscription.id}`,
            amount: plan.price,
            currency: plan.currency,
            status: 'SUCCEEDED',
            receiptUrl: null,
            payload: JSON.stringify({ simulated: true }),
          },
        })

        // Redirect back into app (your redirect handler can just show success and route to dashboard)
        const url = `${origin}/pricing/redirect?sub=${subscription.id}&sim=1`
        return NextResponse.json({ url })
     }

    if (!variantId) {
      return NextResponse.json({ error: 'Missing variantId' }, { status: 400 })
    }

    // Load LS config
    const apiKey = await getSetting('LEMONSQUEEZY_API_KEY')
    const storeId = String(await getSetting('LEMONSQUEEZY_STORE_ID')).trim()
    if (!apiKey || !storeId) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 })
    }

    // Create a Subscription row in DB (status = INCOMPLETE)
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        provider: 'lemonsqueezy',
        planTitle: plan.title,
        planPrice: plan.price,
        planCurrency: plan.currency,
        planBillingCycle: plan.billingCycle,
        status: 'INCOMPLETE',
      },
    })

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                subscriptionId: String(subscription.id), // must be a string
              },
            },
            product_options: {
              redirect_url: `${origin}/pricing/redirect?sub=${subscription.id}`,
            },
          },
          relationships: {
            store: { data: { type: 'stores', id: storeId } },
            variant: { data: { type: 'variants', id: variantId } },
          },
        },
      }),
    })


    if (!res.ok) {
      const errText = await res.text()
      console.error('Lemon Squeezy error:', errText)
      // mark subscription as failed
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'INCOMPLETE' },
      })
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
    }

    const data = await res.json()
    const url = data?.data?.attributes?.url
    const lsCheckoutId = data?.data?.id

    if (!url || !lsCheckoutId) {
      return NextResponse.json({ error: 'Checkout URL missing' }, { status: 500 })
    }

    // Update subscription with LS checkout ID + URL
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        providerCheckoutId: lsCheckoutId,
      },
    })

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Purchase API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
