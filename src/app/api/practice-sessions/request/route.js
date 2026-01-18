import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.scheduleRequest.findMany({
      where: {
        status: 'pending',
        schedule: {
          host_user_id: user.id
        }
      },
      orderBy: {
        created_at: 'asc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        schedule: {
          select: {
            id: true,
            title: true,
            scheduled_at: true
          }
        }
      }
    })

    return NextResponse.json(requests)
  } catch (err) {
    console.error('Fetch schedule requests error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { schedule_id } = await req.json()

    const existing = await prisma.scheduleRequest.findFirst({
      where: {
        schedule_id,
        user_id: user.id
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      )
    }

    const request = await prisma.scheduleRequest.create({
      data: {
        schedule_id,
        user_id: user.id,
        status: 'pending'
      }
    })

    return NextResponse.json(request)
  } catch (err) {
    console.error('Request session error:', err)
    return NextResponse.json(
      { error: 'Failed to request session' },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { request_id, status } = await req.json()

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const request = await prisma.scheduleRequest.findUnique({
      where: { id: request_id },
      include: { schedule: true }
    })

    if (!request || request.schedule.host_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.scheduleRequest.update({
      where: { id: request_id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Update request error:', err)
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
}
