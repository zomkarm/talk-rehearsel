import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma/client'
import {getSetting} from '@/lib/settings'

export async function POST(req) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')
    const secret = await getSetting('LEMONSQUEEZY_WEBHOOK_SECRET') 

    //console.log('Incoming webhook')
    //console.log('Raw body:', rawBody)

    // Verify signature
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(rawBody, 'utf8')
    const digest = hmac.digest('hex')
    
    if (digest !== signature) {
      //console.error(' Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const type = event.meta.event_name
    const data = event.data
    const attrs = data.attributes

    switch (type) {
      case 'order_created': {
        // Prefer meta.custom_data.subscriptionId
        const customSubId =
          event.meta?.custom_data?.subscriptionId ||
          attrs.checkout_data?.custom?.subscriptionId

        //console.log('Resolved subscriptionId:', customSubId)

        if (!customSubId) {
          console.warn(' No subscriptionId found in meta.custom_data or checkout_data.custom')
          break
        }

        //console.log(' Creating payment record in DB...')
        const payment = await prisma.payment.create({
          data: {
            subscriptionId: customSubId,
            provider: 'lemonsqueezy',
            providerPaymentId: data.id,
            amount: attrs.total / 100,
            currency: attrs.currency,
            status: 'SUCCEEDED',
            receiptUrl: attrs.urls?.receipt,
            payload: rawBody,
          },
        })
        //console.log(' Payment created:', payment)

        //console.log(' Updating subscription record...')
        const updatedSub = await prisma.subscription.update({
          where: { id: customSubId },
          data: {
            status: 'ACTIVE',
            providerCustomerId: String(attrs.customer_id),
            updatedAt: new Date(),
          },
        })
        //console.log(' Subscription updated:', updatedSub)
        break
      }

      case 'subscription_created': {
        //console.log(' subscription_created event')
        const result = await prisma.subscription.updateMany({
          where: { providerCheckoutId: attrs.checkout_id },
          data: {
            providerSubscriptionId: data.id,
            status: 'ACTIVE',
            currentPeriodStart: attrs.current_period_start
              ? new Date(attrs.current_period_start)
              : null,
            currentPeriodEnd: attrs.current_period_end
              ? new Date(attrs.current_period_end)
              : null,
          },
        })
        //console.log(' subscription_created updateMany result:', result)
        break
      }

      case 'subscription_updated': {
        //console.log(' subscription_updated event')
        const result = await prisma.subscription.updateMany({
          where: { providerSubscriptionId: data.id },
          data: {
            status: attrs.status?.toUpperCase() || 'ACTIVE',
            currentPeriodEnd: attrs.current_period_end
              ? new Date(attrs.current_period_end)
              : null,
          },
        })
        //console.log(' subscription_updated updateMany result:', result)
        break
      }

      case 'subscription_cancelled': {
        //console.log(' subscription_cancelled event')
        const result = await prisma.subscription.updateMany({
          where: { providerSubscriptionId: data.id },
          data: { status: 'CANCELED', cancelAtPeriodEnd: true },
        })
        //console.log(' subscription_cancelled updateMany result:', result)
        break
      }

      default:
        console.log(' Unhandled event type:', type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error(' Webhook error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
