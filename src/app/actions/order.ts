"use server"

import prisma from "@/db/db"
import { getSession } from "@/lib/sessionAction"

export async function getCheckoutData(email: string, productId: string) {
  return (
    (await prisma.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
