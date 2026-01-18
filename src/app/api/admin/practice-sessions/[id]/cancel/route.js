import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/authAdmin'

export async function PATCH(req, { params }) {
  try {
    const admin = await getUserFromToken()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    await prisma.practiceSchedule.update({
      where: { id: params.id },
      data: {
        status: 'cancelled',
        admin_cancel_reason: body.reason || 'Cancelled by admin',
        admin_cancelled_at: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin cancel error:', err)
    return NextResponse.json(
      { error: 'Failed to cancel session' },
      { status: 500 }
    )
  }
}
