import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET: List components with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const skip = (page - 1) * limit

    const [components, totalCount] = await Promise.all([
      prisma.uIComponent.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.uIComponent.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({ components, page, totalPages, totalCount })
  } catch (error) {
    console.error('GET /ui-components error:', error)
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 })
  }
}

// POST: Create new component
export async function POST(req) {
  try {
    const body = await req.json()
    const {
      slug, name, category, tags = [], html_css, tailwind_code,
      preview_image = null, status = 'active'
    } = body

    const component = await prisma.uIComponent.create({
      data: {
        slug,
        name,
        category,
        tags,
        html_css,
        tailwind_code,
        preview_image,
        status,
      },
    })

    return NextResponse.json(component, { status: 201 })
  } catch (error) {
    console.error('POST /ui-components error:', error)
    return NextResponse.json({ error: 'Failed to create component' }, { status: 400 })
  }
}

// PUT: Update component by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Component ID required' }, { status: 400 })

    const body = await req.json()
    const {
      slug, name, category, tags, html_css, tailwind_code,
      preview_image, status
    } = body

    const component = await prisma.uIComponent.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(html_css && { html_css }),
        ...(tailwind_code && { tailwind_code }),
        ...(preview_image !== undefined && { preview_image }),
        ...(status && { status }),
      },
    })

    return NextResponse.json(component)
  } catch (error) {
    console.error('PUT /ui-components error:', error)
    return NextResponse.json({ error: 'Failed to update component' }, { status: 400 })
  }
}

// DELETE: Remove component by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Component ID required' }, { status: 400 })

    await prisma.uIComponent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /ui-components error:', error)
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 400 })
  }
}
