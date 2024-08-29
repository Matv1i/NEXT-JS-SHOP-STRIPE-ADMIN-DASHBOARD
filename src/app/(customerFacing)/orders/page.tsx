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

export default async function MyOrdersPage() {
  const orders: any = await getSpecificOrders()

  const handleDownload = async (productId: string) => {
    const verification = await createDownloadVerification(productId)
    return verification
  }

  return (
    <>
      <form className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Enter your email and we will email you your order history and
              download link
            </CardDescription>
          </CardHeader>
        </Card>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        {orders.map((order: any) => (
          <CardOrder
            key={order.id} // Use a unique key from the order data
            name={order.products.name}
            description={order.products.description}
            imagePath={order.products.imagePath}
            priceInCents={order.pricePaidInCents}
            pathDownload={order.products.id}
          />
        ))}
      </div>
    </>
  )
}
