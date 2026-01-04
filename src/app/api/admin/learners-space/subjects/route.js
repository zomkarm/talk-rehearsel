import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET: List all subjects
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const skip = (page - 1) * limit

    const [subjects, totalCount] = await Promise.all([
      prisma.subject.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subject.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      subjects,
      page,
      totalPages,
      totalCount,
    })
  } catch (error) {
    console.error('GET /subjects error:', error)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// POST: Create new subject
export async function POST(req) {
  try {
    const body = await req.json()
    const { title, slug, description } = body

    const subject = await prisma.subject.create({
      data: {
        title,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('POST /subjects error:', error)
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 400 })
  }
}

// PUT: Update subject by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Subject ID required' }, { status: 400 })

    const body = await req.json()
    const { title, slug, description } = body

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('PUT /subjects error:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 400 })
  }
}

// DELETE: Remove subject by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Subject ID required' }, { status: 400 })

    await prisma.subject.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /subjects error:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 400 })
  }
}
