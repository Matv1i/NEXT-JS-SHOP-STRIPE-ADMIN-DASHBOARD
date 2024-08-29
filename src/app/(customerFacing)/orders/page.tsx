import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"
import { getSpecificOrders } from "./_actions/route"
import { CardOrder } from "./_components/Card"
import { createDownloadVerification } from "../stripe/purchase-success/page"
import { getSession } from "@/lib/sessionAction"
import prisma from "@/db/db"

export default async function MyOrdersPage() {
  const orders: any = await getSpecificOrders()

  return (
    <>
      <div className="w-full flex justify-start mb-4">
        <p className="text-4xl font-bold">My orders</p>
      </div>

      <div className="flex flex-col md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        {orders.map(async (order: any) => {
          const cookie = await getSession()
          const userId: string = cookie.id
          let link: string
          const item = await prisma.downloadVerification.findFirst({
            where: {
              productId: order.products.id,
              userId,
            },
          })
          if (!item) {
            const verification = await createDownloadVerification(
              order.products.id
            )

            link = `products/download/${verification}`
          } else {
            link = `products/download/${item.id}`
          }

          return (
            <CardOrder
              key={order.id}
              name={order.products.name}
              description={order.products.description}
              imagePath={order.products.imagePath}
              priceInCents={order.pricePaidInCents}
              pathDownload={link}
            />
          )
        })}
      </div>
    </>
  )
}
