import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import prisma from "@/db/db"

import { formatCurrency, formatNumber } from "@/lib/formaters"
import { PageHeader } from "../_components/Header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { DeleteDropDownItem } from "../users/_components/UserAction"

function getOrders() {
  return prisma.order.findMany({
    select: {
      id: true,
      user: true,
      products: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default function UsersPage() {
  return (
    <>
      <PageHeader>Orders</PageHeader>
      <UsersTable />
    </>
  )
}

async function UsersTable() {
  const orders = await getOrders()

  if (orders.length === 0) return <p>No orders found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>{order.products.name}</TableCell>
            <TableCell>
              {formatCurrency(order.products.priceInCents / 100)}
            </TableCell>
            <TableCell>
              {`${order.createdAt.toDateString()}  ${order.createdAt.getUTCHours()}:${order.createdAt.getUTCMinutes()}`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
