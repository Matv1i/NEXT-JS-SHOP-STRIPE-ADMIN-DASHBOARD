import { NextRequest, NextResponse } from "next/server"
import { isValidPassword } from "./lib/isValidPassword"
import jwt from "jsonwebtoken"

export async function middleware(req: NextRequest) {
  // Проверка базовой аутентификации администратора
  if (!(await isAuthentificatedAdmin(req))) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    })
  }

  // Проверка JWT токена
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")

  try {
    const SECRET_KEY = process.env.JWT_CRYPTO
    if (!SECRET_KEY) throw new Error("Secret key not defined")

    jwt.verify(token, SECRET_KEY)
    return NextResponse.next()
  } catch (error) {
    console.error("JWT verification failed:", error)
  }
}

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

export const config = {
  matcher: "/admin/:path*",
}
