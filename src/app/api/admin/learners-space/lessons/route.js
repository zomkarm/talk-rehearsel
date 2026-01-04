import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET: List lessons with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const skip = (page - 1) * limit

    const [lessons, totalCount] = await Promise.all([
      prisma.lesson.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: { category: true }, // include category info
      }),
      prisma.lesson.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      lessons,
      page,
      totalPages,
      totalCount,
    })
  } catch (error) {
    console.error('GET /lessons error:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

// POST: Create new lesson
export async function POST(req) {
  try {
    const body = await req.json()
    const { title, slug, description, categoryId, order } = body

    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug,
        description: description || null,
        categoryId: Number(categoryId),
        order: Number(order) || 0,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('POST /lessons error:', error)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 400 })
  }
}

// PUT: Update lesson by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })

    const body = await req.json()
    const { title, slug, description, categoryId, order } = body

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('PUT /lessons error:', error)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 400 })
  }
}

// DELETE: Remove lesson by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })

    await prisma.lesson.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /lessons error:', error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 400 })
  }
}
