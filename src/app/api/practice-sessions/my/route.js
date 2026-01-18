import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.practiceSchedule.findMany({
      where: {
        host_user_id: user.id
      },
      orderBy: {
        scheduled_at: 'desc'
      },
      include: {
        requests: true
      }
    })

    return NextResponse.json(sessions)
  } catch (err) {
    console.error('Fetch my sessions error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
