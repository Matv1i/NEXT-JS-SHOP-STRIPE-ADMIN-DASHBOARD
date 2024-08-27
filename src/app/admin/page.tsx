import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import prisma from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formaters"
import { get } from "http"

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })
  console.log(data)
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  }
}
async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  console.log("user data:" + { userCount, orderData })
  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}
async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ])
  return { activeCount, inactiveCount }
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductData(),
  ])

  return (
    <div className="grid grod-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Dashboard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)}  Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <Dashboard
        title="Customers "
        subtitle={` ${formatCurrency(
          userData.averageValuePerUser
        )} Average value`}
        body={formatNumber(userData.userCount)}
      />
      <Dashboard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)}  Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}
function Dashboard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>{body}</CardContent>
    </Card>
  )
}
