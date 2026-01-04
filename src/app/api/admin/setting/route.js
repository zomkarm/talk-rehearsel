import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET /api/admin/setting
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }, // deterministic order
    })
    return NextResponse.json({ settings })
  } catch (err) {
    console.error('Settings GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/setting
export async function POST(req) {
  try {
    const body = await req.json()
    const newSetting = await prisma.setting.create({
      data: {
        key: body.key,
        value: body.value ?? '',
        description: body.description ?? '',
      },
    })
    return NextResponse.json(newSetting, { status: 201 })
  } catch (err) {
    console.error('Settings POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/setting?id=123
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)

    const body = await req.json()
    const updatedSetting = await prisma.setting.update({
      where: { id },
      data: {
        key: body.key,
        value: body.value ?? '',
        description: body.description ?? '',
      },
    })
    return NextResponse.json(updatedSetting)
  } catch (err) {
    console.error('Settings PUT error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/setting?id=123
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)

    await prisma.setting.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Settings DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
