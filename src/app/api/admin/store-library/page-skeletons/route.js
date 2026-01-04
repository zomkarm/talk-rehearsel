import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

// GET: List skeletons with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const skip = (page - 1) * limit

    const [skeletons, totalCount] = await Promise.all([
      prisma.pageSkeleton.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.pageSkeleton.count(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({ skeletons, page, totalPages, totalCount })
  } catch (error) {
    console.error('GET /page-skeletons error:', error)
    return NextResponse.json({ error: 'Failed to fetch skeletons' }, { status: 500 })
  }
}

// POST: Create new skeleton
export async function POST(req) {
  try {
    const body = await req.json()
    const {
      slug, name, description = null, tags = [],
      html_css, tailwind_code, preview_image = null,
      status = 'active'
    } = body

    const skeleton = await prisma.pageSkeleton.create({
      data: {
        slug,
        name,
        description,
        tags,
        html_css,
        tailwind_code,
        preview_image,
        status,
      },
    })

    return NextResponse.json(skeleton, { status: 201 })
  } catch (error) {
    console.error('POST /page-skeletons error:', error)
    return NextResponse.json({ error: 'Failed to create skeleton' }, { status: 400 })
  }
}

// PUT: Update skeleton by ID
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Skeleton ID required' }, { status: 400 })

    const body = await req.json()
    const {
      slug, name, description, tags, html_css,
      tailwind_code, preview_image, status
    } = body

    const skeleton = await prisma.pageSkeleton.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(tags && { tags }),
        ...(html_css && { html_css }),
        ...(tailwind_code && { tailwind_code }),
        ...(preview_image !== undefined && { preview_image }),
        ...(status && { status }),
      },
    })

    return NextResponse.json(skeleton)
  } catch (error) {
    console.error('PUT /page-skeletons error:', error)
    return NextResponse.json({ error: 'Failed to update skeleton' }, { status: 400 })
  }
}

// DELETE: Remove skeleton by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id'), 10)
    if (!id) return NextResponse.json({ error: 'Skeleton ID required' }, { status: 400 })

    await prisma.pageSkeleton.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /page-skeletons error:', error)
    return NextResponse.json({ error: 'Failed to delete skeleton' }, { status: 400 })
  }
}
