import prisma from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import { getSession } from "@/lib/sessionAction"

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin))
  }

  const data = await prisma.downloadVerification.findFirst({
    where: { id: downloadVerificationId },
    select: {
      productId: true,
      userId: true,
    },
  })

  if (!data) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.nextUrl.origin)
    )
  }

  const product = await prisma.product.findFirst({
    where: { id: data.productId },
  })

  if (!product) {
    return NextResponse.json({
      error: "Can't find the product",
    })
  }

  if (data.userId === session.id) {
    const { size } = await fs.stat(product.filePath)
    const file = await fs.readFile(product.filePath)
    const extension = product.filePath.split(".").pop()

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
      },
    })
  } else {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin))
  }
}
