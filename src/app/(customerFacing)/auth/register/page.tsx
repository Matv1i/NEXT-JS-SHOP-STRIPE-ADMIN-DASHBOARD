"use client"

import { registerUser } from "@/app/api/register/auth"
import React, { useState } from "react"

import { useRouter } from "next/navigation"
import { any } from "zod"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | undefined | string[]>(undefined)
  const router = useRouter()

  async function hanleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const formData = { name, email, password }
      const response = await registerUser(formData)
      if (response?.status === 201) {
        localStorage.setItem("token", response.token)
        console.log("good")
        router.push("/")
      } else {
        setError(response?.error)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  //
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setName(e.target.value.trim())}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="text"
              id="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setPassword(e.target.value.trim())}
            />
          </div>
          <div>
            <p className="text-red-500">{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-opacity-75"
            onClick={hanleSubmit}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
