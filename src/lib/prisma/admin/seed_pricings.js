import prisma from '@/lib/prisma/client'

export async function PricingSeeder() {
  try {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE
          "pricing"
        RESTART IDENTITY CASCADE
      `);
    
    await prisma.pricing.createMany({
      data: [
          {
            title: 'Free',
            description: 'Explore the core features and get started',
            price: 0,
            currency: 'USD',
            billingCycle: 'free',
            features: [
              'Access basic features',
              'Limited usage per day',
              'Standard performance',
              'Community support',
              'No credit card required'
            ],
            ctaLabel: 'Get Started',
            theme: 'gray',
            isActive: true
          },
          {
            title: 'Pro',
            description: 'For individuals who want more control and flexibility',
            price: 9,
            currency: 'USD',
            billingCycle: 'monthly',
            features: [
              'Everything in Free',
              'Higher usage limits',
              'Faster processing',
              'Save and manage your data',
              'Priority feature access'
            ],
            ctaLabel: 'Upgrade to Pro',
            badge: 'Most Popular',
            theme: 'blue',
            isActive: true
          },
          {
            title: 'Pro Annual',
            description: 'Best value for long-term users',
            price: 79,
            currency: 'USD',
            billingCycle: 'annual',
            features: [
              'Everything in Pro',
              'Significant yearly savings',
              'Early access to new features',
              'Priority support'
            ],
            ctaLabel: 'Go Annual',
            theme: 'green',
            isActive: true
          }
      ]
    })

    console.log('Added Pricings successfully')
  } catch (err) {
    console.error('Failure while adding pricings:', err)
  }
}
