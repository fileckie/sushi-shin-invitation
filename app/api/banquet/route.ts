import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: data.restaurantName }
    })
    
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          name: data.restaurantName,
          address: data.restaurantAddress,
          phone: data.restaurantPhone,
          description: data.restaurantDesc,
          chefName: data.chefName,
          chefTitle: data.chefTitle,
        }
      })
    }
    
    const banquet = await prisma.banquet.create({
      data: {
        title: data.title,
        date: data.date,
        time: data.time,
        guestCount: parseInt(data.guestCount),
        roomName: data.roomName,
        hostName: data.hostName,
        hostPhone: data.hostPhone,
        notes: data.notes,
        menu: JSON.stringify(data.menu),
        specialDishes: JSON.stringify(data.menu.filter((d: any) => d.isSignature)),
        restaurantId: restaurant.id,
      }
    })
    
    return NextResponse.json({ id: banquet.id })
  } catch (error) {
    console.error('Error creating banquet:', error)
    return NextResponse.json(
      { error: 'Failed to create banquet' },
      { status: 500 }
    )
  }
}
