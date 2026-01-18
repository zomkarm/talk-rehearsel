import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const session = await prisma.practiceSchedule.findUnique({
      where: { id: params.id }
    })

    if (!session || session.host_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sessionEnd =
      new Date(session.scheduled_at).getTime() +
      session.duration_minutes * 60000

    if (sessionEnd < Date.now()) {
      return NextResponse.json(
        { error: 'Session has already ended' },
        { status: 400 }
      )
    }


    const {
      title,
      description,
      scheduled_at,
      timezone,
      duration_minutes,
      mode,
      max_participants,
      room_link
    } = body

    const updated = await prisma.practiceSchedule.update({
      where: { id: params.id },
      data: {
        title,
        description,
        scheduled_at: new Date(scheduled_at),
        timezone,
        duration_minutes,
        mode,
        max_participants,
        room_link
      }
    })


    return NextResponse.json(updated)
  } catch (err) {
    console.error('Update session error:', err)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.practiceSchedule.findUnique({
      where: { id: params.id }
    })

    if (!session || session.host_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    if (session.status === 'cancelled') {
      return NextResponse.json({ error: 'Session already cancelled' }, { status: 400 })
    }


    await prisma.practiceSchedule.update({
      where: { id: params.id },
      data: { status: 'cancelled' }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Cancel session error:', err)
    return NextResponse.json(
      { error: 'Failed to cancel session' },
      { status: 500 }
    )
  }
}
