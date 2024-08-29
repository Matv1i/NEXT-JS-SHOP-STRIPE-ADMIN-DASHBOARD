"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        router.push("/")
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      setError("An Occrred during registration")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form>
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
          <div className="mb-2">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-primary"
              required
              onChange={(e) => setPassword(e.target.value.trim())}
            />
          </div>
          <div className="my-4">
            <a
              href="/auth/register"
              className="text-primary cursor-pointer hover:text-purple-900 "
            >
              Dont have a account?
            </a>
          </div>
          <div>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2  focus:ring-opacity-75"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
