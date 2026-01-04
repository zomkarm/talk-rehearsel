import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import prisma from '@/lib/prisma/client'

// GET a single preference
export async function GET(req, { params }) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { key } = await params
    const pref = await prisma.userPreference.findUnique({
      where: { userId_key: { userId: user.id, key } },
    })

    if (!pref) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pref, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// UPSERT (create if missing, update if exists)
export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { key } = await params
    const { value } = await req.json()
    if (value === undefined) {
      return NextResponse.json({ error: 'Missing value' }, { status: 400 })
    }

    const updated = await prisma.userPreference.upsert({
      where: { userId_key: { userId: user.id, key } },
      update: { value: String(value) },
      create: { userId: user.id, key, value: String(value) },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
