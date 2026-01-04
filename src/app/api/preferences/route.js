import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import prisma from '@/lib/prisma/client'

// GET all preferences for current user
export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const prefs = await prisma.userPreference.findMany({
      where: { userId: user.id },
      select: { key: true, value: true },
    })

    // return as object { key: value }
    const result = prefs.reduce((acc, p) => {
      acc[p.key] = p.value
      return acc
    }, {})

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

