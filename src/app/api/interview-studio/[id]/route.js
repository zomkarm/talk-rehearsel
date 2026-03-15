import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromToken()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const interview = await prisma.interview.findUnique({
      where: { id }
    })

    if (!interview || interview.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    await prisma.interview.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true
    })

  } catch (err) {
    console.error('Delete interview error:', err)

    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    )
  }
}