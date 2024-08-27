"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteUser } from "../../products/_actions/user"

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const success = await deleteUser(id)
            if (!success) {
              console.error("User not found or already deleted.")
              // Handle UI update if user not found
            }
          } catch (error) {
            console.error("Failed to delete user:", error)
          } finally {
            router.refresh()
          }
        })
      }
    >
      {isPending ? "Deleting..." : "Delete"}
    </DropdownMenuItem>
  )
}
