import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET /api/admin/unscripted-practice?page=1&limit=10
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const [questions, total] = await Promise.all([
      prisma.unscriptedQuestion.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.unscriptedQuestion.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      questions,
      page,
      totalPages,
      total,
    })
  } catch (err) {
    console.error('UnscriptedPractice GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/unscripted-practice
export async function POST(req) {
  try {
    const body = await req.json()

    const created = await prisma.unscriptedQuestion.create({
      data: {
        question: body.question,
        level: body.level,
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('UnscriptedPractice POST error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/unscripted-practice?id=123
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      )
    }

    const id = parseInt(idParam, 10)
    const body = await req.json()

    const updated = await prisma.unscriptedQuestion.update({
      where: { id },
      data: {
        question: body.question,
        level: body.level,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('UnscriptedPractice PUT error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/unscripted-practice?id=123
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      )
    }

    const id = parseInt(idParam, 10)

    await prisma.unscriptedQuestion.delete({ where: { id } })

    return NextResponse.json({ message: 'Question deleted' })
  } catch (err) {
    console.error('UnscriptedPractice DELETE error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
