import prisma from "@/db/db"
import { cache } from "@/lib/cache"
import { Product } from "@prisma/client"

export const getMostPopularProduct = cache(
  async () => {
    return await prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    })
  },
  ["/", "getMostPopularProduct"],
  { revalidate: 60 * 60 * 24 }
)

export const getNewestProduct = cache(
  async () => {
    return await prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
  },
  ["/", "getNewestProduct"],
  { revalidate: 60 * 60 * 24 }
)
