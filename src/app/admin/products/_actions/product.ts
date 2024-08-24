"use server"

import prisma from "@/db/db"
import { describe } from "node:test"
import { date, optional, string, z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
})
const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function addProduct(prevState: unknown, formdata: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formdata.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  //save file
  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  //save image

  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  await prisma.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })
  revalidatePath("/")
  revalidatePath("/products ")
  redirect("/admin/products")
}

export async function editProduct(
  id: string,
  prevState: unknown,
  formdata: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formdata.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  const product = await prisma.product.findUnique({ where: { id } })
  if (product == null) return notFound()

  let filePath = product.filePath
  if (data.file && data.file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `products/${crypto.randomUUID()}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image && data.image.size > 0) {
    await fs.unlink(`public/${product.imagePath}`)
    imagePath = `/products/${crypto.randomUUID()}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })
  revalidatePath("/")
  revalidatePath("/products ")
  redirect("/admin/products")
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await prisma.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  })

  revalidatePath("/")
  revalidatePath("/products ")
}
export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } })
  if (product === null) return notFound()
  await fs.unlink(product.filePath)
  await fs.unlink(`public/${product.imagePath}`)
  revalidatePath("/")
  revalidatePath("/products ")
}
