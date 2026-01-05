import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const lineId = formData.get('line_id')
    const accent = formData.get('accent')
    const file = formData.get('audio')

    if (!lineId || !accent || !file) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`

    const uploadDir = path.join(
      process.cwd(),
      'public/uploads/talkrehearsel/voices'
    )

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, buffer)

    const audio_src = `/uploads/talkrehearsel/voices/${filename}`

    const voice = await prisma.lineVoice.create({
      data: {
        line_id: lineId,
        accent,
        audio_src
      }
    })

    return NextResponse.json({ voice })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to upload voice' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const voice = await prisma.lineVoice.findUnique({
      where: { id }
    })

    if (!voice) {
      return NextResponse.json({ success: true })
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      voice.audio_src
    )

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await prisma.lineVoice.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    )
  }
}
