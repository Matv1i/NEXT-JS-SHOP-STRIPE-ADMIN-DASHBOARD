"use server"
import prisma from "@/db/db"
import { error } from "console"
import { NextResponse } from "next/server"
import { string } from "zod"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
interface UserProps {
  name: string
  email: string
  password: string
}

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})
const SECRET_KEY = process.env.JWT_CRYPTO as string

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, password } = UserSchema.parse(body)

    const existUser = await prisma.user.findFirst({
      where: { email },
    })
    if (existUser) {
      return NextResponse.json(
        {
          error: "User a;ready exist ",
        },
        { status: 400 }
      )
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    )

    console.log(token, "Token route registarion ")
    const response = NextResponse.json({
      message: "User registered successfully",
    })

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    })
    console.log(cookies().get("session"))

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => err.message)
      return NextResponse.json({ error: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
