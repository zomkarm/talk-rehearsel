import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET: List snippets with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const skip = (page - 1) * limit

    const [snippets, totalCount] = await Promise.all([
      prisma.tutorSnippet.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.tutorSnippet.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({ snippets, page, totalPages, totalCount })
  } catch (error) {
    console.error('GET /ui-snippets error:', error)
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 })
  }
}

// POST: Create new snippet
export async function POST(req) {
  try {
    const body = await req.json()
    const {
      name, category = null, raw_html,
      preview_image = null
    } = body

    const snippet = await prisma.tutorSnippet.create({
      data: {
        name,
        category,
        raw_html,
        preview_image,
      },
    })

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error('POST /ui-snippets error:', error)
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 400 })
  }
}

// PUT: Update snippet by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Snippet ID required' }, { status: 400 })

    const body = await req.json()
    const { name, category, raw_html, preview_image } = body

    const snippet = await prisma.tutorSnippet.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category !== undefined && { category }),
        ...(raw_html && { raw_html }),
        ...(preview_image !== undefined && { preview_image }),
      },
    })

    return NextResponse.json(snippet)
  } catch (error) {
    console.error('PUT /ui-snippets error:', error)
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 400 })
  }
}

// DELETE: Remove snippet by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Snippet ID required' }, { status: 400 })

    await prisma.tutorSnippet.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /ui-snippets error:', error)
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 400 })
  }
}
