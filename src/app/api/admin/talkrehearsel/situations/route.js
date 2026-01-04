import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const skip = (page - 1) * limit

    const [situations, total] = await Promise.all([
      prisma.situation.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true
        }
      }),
      prisma.situation.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      situations,
      page,
      totalPages
    })
  } catch (err) {
    console.error('GET situations error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch situations' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Situation ID is required' },
        { status: 400 }
      )
    }

    await prisma.situation.delete({
      where: { id }
      // Cascade already handled by schema
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE situation error:', err)
    return NextResponse.json(
      { error: 'Failed to delete situation' },
      { status: 500 }
    )
  }
}
