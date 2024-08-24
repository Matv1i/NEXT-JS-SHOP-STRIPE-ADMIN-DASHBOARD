"use client"
import { userOrderExists } from "@/app/actions/order"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/formaters"
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { error } from "console"
import Image from "next/image"
import { FormEvent, useState } from "react"

type Props = {
  product: {
    id: string
    imagePath: string
    name: string
    priceInCents: number
    description: string
  }
  clientSecret: string
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
export function CheckoutForm({ product, clientSecret }: Props) {
  const locale = "en"
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
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
        </div>
      </div>
      <Elements options={{ clientSecret, locale }} stripe={stripe}>
        <Form productId={product.id} priceInCents={product.priceInCents} />
      </Elements>
    </div>
  )
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number
  productId: string
}) {
  const stripe = useStripe()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()
  const elements = useElements()
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (stripe == null || elements == null) return setIsLoading(true)

    const orderExists = await userOrderExists(email, productId)
    if (orderExists) {
      setErrorMessage("You have already this product ")
      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("An unknown Error")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={
              stripe == null || elements == null || isLoading || email == null
            }
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
