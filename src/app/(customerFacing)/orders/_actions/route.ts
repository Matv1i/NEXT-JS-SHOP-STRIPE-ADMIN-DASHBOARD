"use server"
import prisma from "@/db/db"
import { getSession } from "@/lib/sessionAction"
import { redirect } from "next/navigation"
import { use } from "react"

export async function getSpecificOrders() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }
  const userId = session.id

  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      orders: {
        select: {
          id: true,
          createdAt: true,
          pricePaidInCents: true,
          products: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  })
  return userInfo?.orders || []
}
