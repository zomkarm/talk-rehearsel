import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const user = await getUserFromToken()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { id } = await params

    const interviewId = id

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        user_id: user.id
      },
      select: {
        id: true,
        title: true,
        target_role: true,
        difficulty: true,
        question_count: true,
        questions: {
          orderBy: {
            order_index: 'asc'
          },
          select: {
            id: true,
            order_index: true,
            question_text: true
          }
        }
      }
    })

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(interview)

  } catch (err) {
    console.error('Fetch interview questions error:', err)

    return NextResponse.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    )
  }
}

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