"use server"

import prisma from "@/db/db"

export async function userOrderExists(
  email: string | undefined,
  productId: string
) {
  return (
    (await prisma.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
