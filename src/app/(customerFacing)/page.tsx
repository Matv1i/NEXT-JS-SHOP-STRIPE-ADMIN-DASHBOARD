import { Button } from "@/components/ui/button"
import { Product } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"

import { getMostPopularProduct, getNewestProduct } from "./_actions/actions"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="space-y-12">
      <ProductGridSection title="Newest" productFetching={getNewestProduct} />
      <ProductGridSection
        title="Popular"
        productFetching={getMostPopularProduct}
      />
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  productFetching: () => Promise<Product[]>
}
function ProductGridSection({
  title,
  productFetching,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <p className=" font-semibold text-2xl">{title}</p>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span> View All</span>
            <ArrowRight className="size-4"></ArrowRight>
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense funcFetch={productFetching} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductSuspense({
  funcFetch,
}: {
  funcFetch: () => Promise<Product[]>
}) {
  return (await funcFetch()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ))
}
