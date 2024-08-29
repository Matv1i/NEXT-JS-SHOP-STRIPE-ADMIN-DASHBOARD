import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { format } from "path"
import { formatCurrency } from "@/lib/formaters"
interface PropsOrders {
  name: string
  description: string
  imagePath: string
  priceInCents: number
  pathDownload: string
}
export function CardOrder({
  name,
  description,
  imagePath,
  priceInCents,
  pathDownload,
}: PropsOrders) {
  const truncateText = (text: string, length = 20): string => {
    if (text.length > length) {
      return text.slice(0, length) + "..."
    }
    return text
  }
  return (
    <Card className="flex overflow-hidden w-1/4 max-lg:w-1/2  flex-col">
      <div className="relative w-full h-auto aspect-video object-cover">
        <Image src={imagePath} fill alt="nasd" />
      </div>
      <CardHeader>
        <CardTitle>{truncateText(name)}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{truncateText(description)}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={pathDownload}>Download</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
