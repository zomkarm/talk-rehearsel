import prisma from '@/lib/prisma/client';
import { validateContact } from '../../../lib/validations/validateContact'
import { NextResponse } from 'next/server'

// Fetch all contact entries with pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const skip = (page - 1) * limit

    const [contacts, total] = await Promise.all([
      prisma.contactUs.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.contactUs.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ contacts, page, totalPages })
  } catch (err) {
    console.error('Contact Us GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new contact entry
export async function POST(req) {
  try {
    const body = await req.json()
    const errors = validateContact(body)
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 400 })
  	//console.log(body)
    const newContact = await prisma.contactUs.create({
      data: {
        name: body.name || '',
        email: body.email,
        description: body.description
      },
    })

    const response = NextResponse.json({ message: 'Contact successful' })
    return response

  } catch (err) {
    console.error('Contact Us error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete a contact entry
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 })
    }

    await prisma.contactUs.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (err) {
    console.error('Contact Us DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
