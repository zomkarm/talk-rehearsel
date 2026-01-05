import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function POST(req) {
  try {
    const { situation_id, name, order } = await req.json()

    if (!situation_id || !name) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const actor = await prisma.actor.create({
      data: {
        situation_id,
        name,
        order
      }
    })

    return NextResponse.json({ actor })
  } catch (err) {
    console.error('CREATE actor error:', err)
    return NextResponse.json(
      { error: 'Failed to create actor' },
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
        { error: 'Actor ID required' },
        { status: 400 }
      )
    }

    await prisma.actor.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE actor error:', err)
    return NextResponse.json(
      { error: 'Failed to delete actor' },
      { status: 500 }
    )
  }
}
