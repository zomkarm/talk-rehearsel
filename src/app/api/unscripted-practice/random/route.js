import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import { getUserFromToken } from '@/lib/auth'

export async function GET(req) {
  try {

    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'casual'

    const total = await prisma.unscriptedQuestion.count({
      where: { level: category, isActive: true },
    })

    if (total === 0) {
      return NextResponse.json(
        { error: 'No questions available for this category' },
        { status: 404 }
      )
    }

    const randomOffset = Math.floor(Math.random() * total)

    const question = await prisma.unscriptedQuestion.findFirst({
      skip: randomOffset,
      where: {
        level: category,
        isActive: true,
      },
      select: {
        id: true,
        question: true,
      },
    })

    return NextResponse.json(question)
  } catch (err) {
    console.error('Unscripted random question error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}
