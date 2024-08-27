"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/db/db"
import { notFound } from "next/navigation"

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const user = await prisma.user.delete({ where: { id } })
    if (!user) {
      notFound()
    }
    revalidatePath("/admin/users")
    return true
  } catch (error) {
    console.error("Failed to delete user:", error)
    return false
  }
}
