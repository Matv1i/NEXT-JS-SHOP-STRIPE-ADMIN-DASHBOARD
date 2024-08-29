"use server"

import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET_KEY = process.env.JWT_CRYPTO as string

export async function getSession() {
  const token = cookies().get("session")?.value
  console.log("Token from cookie:", token) // Логируем токен для проверки

  if (!token) {
    console.error("No token found in cookies.")
    return null
  }

  try {
    console.log("Attempting to verify token with SECRET_KEY:", SECRET_KEY)
    const decodedToken: any = jwt.verify(token, SECRET_KEY)
    console.log("Token successfully verified:", decodedToken)
    return decodedToken
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function deleteSession() {
  const token = cookies().set("session", "", { expires: new Date(0) })
}

export async function getEmailOfSession() {
  const token = cookies().get("session")?.value

  if (!token) {
    return null
  }

  try {
    const decodedToken: any = jwt.verify(token, SECRET_KEY)
    console.log("Decoded Token:", decodedToken)
    return decodedToken.email
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}
