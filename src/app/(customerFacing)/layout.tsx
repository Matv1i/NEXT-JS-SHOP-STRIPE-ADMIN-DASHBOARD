// src/components/AdminLayout.tsx
"use client"

import Nav, { NavLink } from "@/components/Nav"
import jwt from "jsonwebtoken"
import { useEffect, useState } from "react"

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { email?: string }
        console.log(decodedToken)
        setEmail(decodedToken.email || null)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    } else {
      setEmail("Log In")
    }
  }, [])

  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My orders</NavLink>

        <NavLink href="/">{email}</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  )
}
