import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function POST(req) {
  try {
    const { situation_id, actor_id, text, order } = await req.json()

    if (!situation_id || !actor_id || !text || order == null) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const line = await prisma.line.create({
      data: {
        situation_id,
        actor_id,
        text,
        order
      }
    })

    return NextResponse.json({ line })
  } catch (err) {
    console.error('CREATE line error:', err)
    return NextResponse.json(
      { error: 'Failed to create line' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Line ID required' },
        { status: 400 }
      )
    }

    await prisma.line.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE line error:', err)
    return NextResponse.json(
      { error: 'Failed to delete line' },
      { status: 500 }
    )
  }
}
