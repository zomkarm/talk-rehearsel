import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET(req, { params }) {
  try {
    const situation = await prisma.situation.findUnique({
      where: { id: params.id },
      include: {
        actors: {
          orderBy: { order: 'asc' }
        },
        lines: {
          orderBy: { order: 'asc' },
          include: {
            actor: true,
            voices: true 
          }
        }
      }
    })

    if (!situation) {
      return NextResponse.json(
        { error: 'Situation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ situation })
  } catch (err) {
    console.error('GET situation error:', err)
    return NextResponse.json(
      { error: 'Failed to load situation' },
      { status: 500 }
    )
  }
}
