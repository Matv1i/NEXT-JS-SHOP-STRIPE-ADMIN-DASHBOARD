import { NextRequest, NextResponse } from "next/server"
import { isValidPassword } from "@/lib/isValidPassword"

async function isAuthentificatedAdmin(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization")

  if (!authHeader) return false

  try {
    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":")

    return (
      username === process.env.ADMIN_USERNAME &&
      (await isValidPassword(
        password,
        process.env.HASHED_ADMIN_PASSWORD as string
      ))
    )
  } catch (error) {
    console.error("Basic authentication failed:", error)
    return false
  }
}

export async function middleware(req: NextRequest) {
  if (!(await isAuthentificatedAdmin(req))) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
