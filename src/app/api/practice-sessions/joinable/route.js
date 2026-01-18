import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Sessions user is hosting
    const hosted = await prisma.practiceSchedule.findMany({
      where: {
        host_user_id: user.id,
        status: 'open',
      },
    })

    // Sessions user is approved in
    const approvedRequests = await prisma.scheduleRequest.findMany({
      where: {
        user_id: user.id,
        status: 'approved',
      },
      include: {
        schedule: true,
      },
    })

    const approvedSessions = approvedRequests.map(r => r.schedule)

    const allSessions = [...hosted, ...approvedSessions]

    const uniqueSessions = Array.from(
      new Map(allSessions.map(s => [s.id, s])).values()
    )

    const joinable = uniqueSessions.map(s => {
      const start = new Date(s.scheduled_at)
      const end = new Date(start.getTime() + s.duration_minutes * 60000)

      return {
        id: s.id,
        title: s.title,
        scheduled_at: s.scheduled_at,
        duration_minutes: s.duration_minutes,
        room_link: s.room_link,
        mode: s.mode,
        isHost: s.host_user_id === user.id,
        canJoin: now >= start && now <= end,
        hasEnded: now > end,
        startsAt: start,
      }
    })

    return NextResponse.json(joinable)
  } catch (err) {
    console.error('Joinable sessions error:', err)
    return NextResponse.json(
      { error: 'Failed to load joinable sessions' },
      { status: 500 }
    )
  }
}
