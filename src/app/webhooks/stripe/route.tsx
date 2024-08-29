import prisma from "@/db/db"

import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { NextApiRequest, NextApiResponse } from "next"

import Stripe from "stripe"
import PurchaseReceipt from "@/email/PurchaseReceipt"
import { Product } from "@prisma/client"
import { getSession } from "@/lib/sessionAction"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const resend = new Resend(process.env.RESEND)

async function sendEmails(
  email: string,
  order: any,
  product: Product,
  downloadVerification: string
): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <sadvsvsdvsvsdv@gmail.com>",
      to: email,
      subject: "Hello world",
      react: (
        <PurchaseReceipt order={order} product={product}></PurchaseReceipt>
      ),
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error("Email send failed")
    }

    console.log("Email sent successfully:", data)
  } catch (error) {
    console.error("Error in sendEmails:", error)
  }
}

export async function POST(req: NextRequest) {
  let event

  try {
    const rawBody = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return new NextResponse("Webhook Error: Invalid signature", { status: 400 })
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const email = charge.billing_details.email

    const pricePaidInCents = charge.amount

    //
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    if (!product) {
      console.error(`Product not found for ID: ${productId}`)
      return new NextResponse("Bad request: Product not found", { status: 400 })
    }

    if (product === null || email == null)
      return new NextResponse("Bad request ", { status: 400 })

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    }
    const {
      orders: [order],
    } = await prisma.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    })
  }
  return new NextResponse()
}
