import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await req.json()
    const requestId = params.id

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const request = await prisma.scheduleRequest.findUnique({
      where: { id: requestId },
      include: { schedule: true }
    })

    if (!request || request.schedule.host_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.scheduleRequest.update({
      where: { id: requestId },
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
