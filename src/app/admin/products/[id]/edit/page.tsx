import { PageHeader } from "@/app/admin/_components/Header"
import ProductForm from "../../_components/ProductForm"
import prisma from "@/db/db"

export default async function EditPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await prisma.product.findUnique({ where: { id } })
  return (
    <>
      <PageHeader>Edit Product </PageHeader>
      <ProductForm product={product} />
    </>
  )
}
