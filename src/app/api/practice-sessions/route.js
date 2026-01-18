import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.practiceSchedule.findMany({
      where: {
        status: 'open',
        scheduled_at: {
          gte: new Date()
        }
      },
      orderBy: {
        scheduled_at: 'asc'
      },
      include: {
        requests: {
          where: {
            user_id: user.id
          },
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    const enrichedSessions = sessions.map(s => ({
      ...s,
      isHost: s.host_user_id === user.id,
      hasRequested: s.requests.length > 0,
      requestStatus: s.requests[0]?.status || null
    }))

    return NextResponse.json(enrichedSessions)
  } catch (err) {
    console.error('Fetch practice sessions error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    // Auth
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const {
      title,
      description,
      scheduled_at,
      timezone,
      duration_minutes,
      mode,
      room_link,
      max_participants
    } = body

    // Required checks
    if (
      !title ||
      !scheduled_at ||
      !timezone ||
      !duration_minutes ||
      !mode ||
      !room_link
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!timezone.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid timezone format' },
        { status: 400 }
      )
    }


    // Type coercion
    const parsedDuration = Number(duration_minutes)
    const parsedMaxParticipants = Number(max_participants)

    if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      return NextResponse.json(
        { error: 'Invalid duration_minutes' },
        { status: 400 }
      )
    }

    if (
      Number.isNaN(parsedMaxParticipants) ||
      parsedMaxParticipants < 1
    ) {
      return NextResponse.json(
        { error: 'Invalid max_participants' },
        { status: 400 }
      )
    }

    const session = await prisma.practiceSchedule.create({
      data: {
        host_user_id: user.id,
        title,
        description,
        scheduled_at: new Date(scheduled_at),
        timezone,
        duration_minutes: parsedDuration,
        mode,
        room_provider: 'external',
        room_link,
        max_participants: parsedMaxParticipants,
        status: 'open'
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (err) {
    console.error('Create practice session error:', err)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}