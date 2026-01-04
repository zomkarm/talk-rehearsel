import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {}

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        where,
        orderBy: { order: 'asc' },
        include: { subject: true },
      }),
      prisma.category.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      categories,
      page,
      totalPages,
      totalCount,
    })
  } catch (error) {
    console.error('GET /categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}



// POST: Create new category
export async function POST(req) {
  try {
    const body = await req.json()
    const { title, slug, subjectId, order } = body

    const category = await prisma.category.create({
      data: {
        title,
        slug,
        subjectId: Number(subjectId),
        order: Number(order) || 0,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('POST /categories error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 400 })
  }
}

// PUT: Update category by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 })

    const body = await req.json()
    const { title, slug, subjectId, order } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(subjectId && { subjectId: Number(subjectId) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('PUT /categories error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 400 })
  }
}

// DELETE: Remove category by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 })

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /categories error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 400 })
  }
}
