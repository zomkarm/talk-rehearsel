import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/authAdmin'

export async function GET(req) {
  try {

    const admin = await getUserFromToken()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const where = {}

    if (status) where.status = status

    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)

      where.scheduled_at = {
        gte: start,
        lte: end,
      }
    }

    const [items, total] = await Promise.all([
      prisma.practiceSchedule.findMany({
        where,
        orderBy: { scheduled_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.practiceSchedule.count({ where }),
    ])

    return NextResponse.json({
      items,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('Admin sessions fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
