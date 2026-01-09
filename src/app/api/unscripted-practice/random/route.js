import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    // Count total questions
    const total = await prisma.unscriptedQuestion.count()

    if (total === 0) {
      return NextResponse.json(
        { error: 'No questions available' },
        { status: 404 }
      )
    }

    // Pick random offset
    const randomOffset = Math.floor(Math.random() * total)

    // Fetch one random question
    const question = await prisma.unscriptedQuestion.findFirst({
      skip: randomOffset,
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
