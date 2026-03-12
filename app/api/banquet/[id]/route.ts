import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const banquet = await prisma.banquet.findUnique({
      where: { id: params.id },
      include: { 
        restaurant: true,
        rsvps: {
          select: {
            id: true,
            guestName: true,
            status: true,
            attendeeCount: true,
            dietaryRestrictions: true,
          }
        }
      }
    })
    
    if (!banquet) {
      return NextResponse.json(
        { error: 'Banquet not found' },
        { status: 404 }
      )
    }
    
    const menu = JSON.parse(banquet.menu || '[]')
    const specialDishes = JSON.parse(banquet.specialDishes || '[]')
    
    return NextResponse.json({
      ...banquet,
      menu,
      specialDishes
    })
  } catch (error) {
    console.error('Error fetching banquet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banquet' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banquet.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banquet:', error)
    return NextResponse.json(
      { error: 'Failed to delete banquet' },
      { status: 500 }
    )
  }
}
