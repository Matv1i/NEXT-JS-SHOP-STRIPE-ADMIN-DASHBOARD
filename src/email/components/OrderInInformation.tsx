import { formatCurrency } from "@/lib/formaters"
import {
  Button,
  Column,
  Container,
  Img,
  Row,
  Text,
} from "@react-email/components"
import { Section } from "lucide-react"

type OrderProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  product: { imagePath: string; name: string; description: string }
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
})
export function OrderInformation({ order, product }: OrderProps) {
  console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`)
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Order Id
            </Text>
            <Text className="mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Purchased On
            </Text>
            <Text className="mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Price Paid
            </Text>
            <Text className="mt-0 mr-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Container className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        <Img
          width="100%"
          alt="product name"
          src={`http://localhost:3000${product.imagePath}`}
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-gray-500 mb-0">{product.description}</Text>
          </Column>
        </Row>
      </Container>
    </>
  )
}
