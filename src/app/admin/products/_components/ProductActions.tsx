"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { toggleProductAvailability } from "../_actions/product"
import { deleteProduct } from "../_actions/product"
import { useRouter } from "next/navigation"

export function ActiveToggleDropDown({
  id,
  isAvailableForPurchase,
}: {
  id: string
  isAvailableForPurchase: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      onClick={() =>
        startTransition(async () => {
          try {
            await toggleProductAvailability(id, !isAvailableForPurchase)
          } catch (error) {
            console.error("Failed to toggle product availability:", error)
          } finally {
            router.refresh()
          }
        })
      }
      disabled={isPending}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteToggleDropDown({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  return (
    <DropdownMenuItem
      onClick={() =>
        startTransition(async () => {
          try {
            await deleteProduct(id)
          } catch (error) {
            console.error("Failed to toggle product availability:", error)
          } finally {
            router.refresh()
          }
        })
      }
      disabled={disabled || isPending}
    >
      Delete
    </DropdownMenuItem>
  )
}
