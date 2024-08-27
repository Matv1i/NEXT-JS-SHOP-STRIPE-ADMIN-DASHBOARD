import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInInformation"

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
    description: string
  }
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  downloadVerificationId: string
}

PurchaseReceipt.PreviewProps = {
  product: {
    name: "Product name",
    description: "Some description",
    imagePath:
      "/products/336de996-1e79-48c3-bc64-1d6faa83ce7e-pexels-christian-heitz-285904-842711.jpg",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceipt({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
