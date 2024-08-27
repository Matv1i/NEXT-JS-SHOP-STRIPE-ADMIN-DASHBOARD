"use server"
import prisma from "@/db/db"
import { error } from "console"
import { NextResponse } from "next/server"
import { string } from "zod"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
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

function validation() {}
export async function registerUser(userData: UserProps) {
  try {
    const { name, email, password } = UserSchema.parse(userData)

    const existUser = await prisma.user.findFirst({
      where: { email },
    })
    if (existUser) {
      return { error: "User Already Exist", status: 400 }
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

    return {
      token,
      status: 201,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => err.message)
      return { error: validationErrors, status: 400 }
    }

    return { error: "Something went wrong", status: 500 }
  }
}
