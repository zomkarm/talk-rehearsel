// app/api/user/profile/route.js
import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import prisma from '@/lib/prisma/client'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public/profile_pics')

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profile_pic: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (err) {
    console.error('Error fetching profile:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const name = formData.get('name')
    const file = formData.get('profile_pic')

    const updateData = {}

    // If name is provided, update it
    if (name && typeof name === 'string' && name.trim() !== '') {
      updateData.name = name.trim()
    }

    // If file is provided, handle upload
    if (file && typeof file === 'object') {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })

      // Remove old file if exists
      const existing = await prisma.user.findUnique({
        where: { id: user.id },
        select: { profile_pic: true },
      })
      if (existing?.profile_pic) {
        const oldPath = path.join(UPLOAD_DIR, existing.profile_pic)
        try { await fs.unlink(oldPath) } catch {}
      }

      // Save new file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = path.extname(file.name) || '.png'
      const filename = `${crypto.randomUUID()}${ext}`
      const filepath = path.join(UPLOAD_DIR, filename)
      await fs.writeFile(filepath, buffer)

      updateData.profile_pic = filename
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true, profile_pic: true },
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (err) {
    console.error('Profile update failed:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
