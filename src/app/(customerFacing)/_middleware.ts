"use server"
import { NextRequest, NextResponse } from "next/server"
import { isValidPassword } from "../../lib/isValidPassword"
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.JWT_CRYPTO
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  try {
    if (SECRET_KEY === undefined) {
      throw new Error("Secret key not defined")
    }

    if (!SECRET_KEY) throw new Error("Secret key not defined")

    if (token) {
      console.log(token)
      jwt.verify(token, SECRET_KEY)
      return NextResponse.next()
    } else {
      console.log(token)
      return new NextResponse("Unauthorized", { status: 401 })
    }
  } catch (error) {
    console.error("JWT verification failed:", error)
    return new NextResponse("Unauthorized", { status: 401 })
  }
}

export const config = {
  matcher: "/",
}
