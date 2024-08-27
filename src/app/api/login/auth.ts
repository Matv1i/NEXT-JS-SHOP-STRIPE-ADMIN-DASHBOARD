import prisma from "@/db/db"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { isValidPassword } from "@/lib/isValidPassword"
import { Puritan } from "next/font/google"
import { error } from "console"
import { User } from "@prisma/client"

const SECRET_KEY = process.env.JWT_CRYPTO as string

export async function loginUser(email: string, password: string) {
  try {
    const user: User = prisma.user.findUnique({ where: { email } })

    if (!user) {
      return { error: "invalid email or password", status: 400 }
    }

    const passwordIsValid = isValidPassword(password, user.password)
    if (passwordIsValid) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      )
      return {
        token,
        status: 201,
      }
    }
  } catch (error) {
    return { error: "Something went wrong", status: 500 }
  }
}
