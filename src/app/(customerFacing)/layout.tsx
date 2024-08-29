"use client"

import Nav, { NavLink } from "@/components/Nav"

import { useEffect, useState } from "react"

import { deleteSession, getSession } from "../../lib/sessionAction"

import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [email, setEmail] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const token = await getSession()
      if (!token) {
        setEmail(null)
      } else {
        setEmail(token.email)
      }
    }
    fetchSession()
    router.refresh()
  }, [])

  async function handleDelete() {
    router.refresh()
    return await deleteSession()
  }

  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My orders</NavLink>

        <NavLink href={email ? "/" : "/auth/login"}>
          {email ? email : "Log in"}
        </NavLink>
        <p
          className="p-4 px-6 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground"
          onClick={handleDelete}
        >
          Exit
        </p>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  )
}
