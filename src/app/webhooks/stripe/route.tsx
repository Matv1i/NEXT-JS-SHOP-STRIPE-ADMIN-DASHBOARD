import prisma from "@/db/db"

import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { NextApiRequest, NextApiResponse } from "next"

import Stripe from "stripe"
import PurchaseReceipt from "@/email/PurchaseReceipt"
import { Product } from "@prisma/client"

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
      from: "Acme <matveypolienienkov@gmail.com>",
      to: email,
      subject: "Hello world",
      react: (
        <PurchaseReceipt
          order={order}
          downloadVerificationId={downloadVerification}
          product={product}
        ></PurchaseReceipt>
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
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount
    //
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
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
    const downloadVerification = await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    await sendEmails(email, order, product, downloadVerification.id)
  }
  return new NextResponse()
}
