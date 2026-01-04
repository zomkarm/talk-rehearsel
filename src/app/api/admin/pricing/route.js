import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET /api/admin/pricing?page=1&limit=5
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const skip = (page - 1) * limit

    const [plans, total] = await Promise.all([
      prisma.pricing.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.pricing.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ plans, page, totalPages })
  } catch (err) {
    console.error('Pricing GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/pricing
export async function POST(req) {
  try {
    const body = await req.json()
    const newPlan = await prisma.pricing.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency || 'USD',
        billingCycle: body.billingCycle,
        features: body.features || [],
        badge: body.badge,
        ctaLabel: body.ctaLabel,
        theme: body.theme,
        isActive: body.isActive ?? true,
        lsProductId: body.lsProductId || null,
        lsVariantId: body.lsVariantId || null,
        lsCheckoutUrl: body.lsCheckoutUrl || null,
      },
    })
    return NextResponse.json(newPlan, { status: 201 })
  } catch (err) {
    console.error('Pricing POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/pricing?id=123
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)

    const body = await req.json()
    const updatedPlan = await prisma.pricing.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency,
        billingCycle: body.billingCycle,
        features: body.features,
        badge: body.badge,
        ctaLabel: body.ctaLabel,
        theme: body.theme,
        isActive: body.isActive,
        lsProductId: body.lsProductId || null,
        lsVariantId: body.lsVariantId || null,
        lsCheckoutUrl: body.lsCheckoutUrl || null,
      },
    })
    return NextResponse.json(updatedPlan)
  } catch (err) {
    console.error('Pricing PUT error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/pricing?id=123
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)

    await prisma.pricing.delete({ where: { id } })
    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (err) {
    console.error('Pricing DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
