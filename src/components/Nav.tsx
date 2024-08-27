"use client"
import { FunctionSquare } from "lucide-react"
import React, { Component, ComponentProps, ReactNode, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4">
      {children}
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "classname">) {
  const pathname = usePathname()

  return (
    <Link
      {...props}
      className={cn(
        "p-4 px-6 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href && "bg-background  text-foreground"
      )}
    />
  )
}
