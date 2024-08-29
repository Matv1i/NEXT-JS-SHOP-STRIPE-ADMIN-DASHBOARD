import Image from "next/image"
import { formatCurrency } from "@/lib/formaters"
import Stripe from "stripe"
import { notFound, redirect } from "next/navigation"
import prisma from "@/db/db"
import { Product } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSession } from "@/lib/sessionAction"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {
  const locale = "en"
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  )
  if (paymentIntent.metadata.productId == null) return notFound()

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  })
  if (product == null) return notFound()

  const isSuccess = paymentIntent.status === "succeeded"

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <p className="text-4xl font-bold">{isSuccess ? "Success!" : "Error!"}</p>
      <p className="text-3xl font-semibold">
        {isSuccess ? "Now you can download it from your orders" : null}
      </p>

      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            className="object-cover"
            fill
            alt={product.name}
            src={product.imagePath}
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <p className="text-2xl font-extrabold">{product.name}</p>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a href={"/orders"}>Go to Orders</a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again </Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export async function createDownloadVerification(productId: string) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }
  const userId = session.id
  const data = await prisma.downloadVerification.create({
    data: {
      productId,
      userId: userId,
    },
  })

  return data.id
}
