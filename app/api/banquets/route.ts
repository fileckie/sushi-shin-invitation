import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banquets = await prisma.banquet.findMany({
      include: {
        rsvps: {
          select: {
            status: true,
            attendeeCount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ banquets })
  } catch (error) {
    console.error('Error fetching banquets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banquets' },
      { status: 500 }
    )
  }
}
