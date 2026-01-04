import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// Helpers
const isValidContentType = (t) => ['TEXT', 'CODE', 'EMBED', 'QUIZ'].includes(String(t).toUpperCase())

// GET: List contents with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const skip = (page - 1) * limit

    const [contents, totalCount] = await Promise.all([
      prisma.content.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: { lesson: true }, // include lesson info for display
      }),
      prisma.content.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      contents,
      page,
      totalPages,
      totalCount,
    })
  } catch (error) {
    console.error('GET /contents error:', error)
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 })
  }
}

// POST: Create new content
export async function POST(req) {
  try {
    const body = await req.json()
    const { type, text, code, language, lessonId, order } = body

    // Basic validations
    if (!type || !isValidContentType(type)) {
      return NextResponse.json({ error: 'Invalid or missing content type' }, { status: 400 })
    }
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        type: String(type).toUpperCase(),
        text: text ?? null,
        code: code ?? null,
        language: language ?? null,
        lessonId: Number(lessonId),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('POST /contents error:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 400 })
  }
}

// PUT: Update content by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Content ID required' }, { status: 400 })

    const body = await req.json()
    const { type, text, code, language, lessonId, order } = body

    // Validate type if provided
    if (type !== undefined && !isValidContentType(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        ...(type !== undefined && { type: String(type).toUpperCase() }),
        ...(text !== undefined && { text: text ?? null }),
        ...(code !== undefined && { code: code ?? null }),
        ...(language !== undefined && { language: language ?? null }),
        ...(lessonId !== undefined && { lessonId: Number(lessonId) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('PUT /contents error:', error)
    // Distinguish not found vs bad request if needed
    return NextResponse.json({ error: 'Failed to update content' }, { status: 400 })
  }
}

// DELETE: Remove content by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Content ID required' }, { status: 400 })

    await prisma.content.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /contents error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 400 })
  }
}
