"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Mock authentication - in real app, verify against database
  const users = [
    { id: 1, email: "admin@quickdesk.com", password: "admin123", name: "Admin User", role: "admin" },
    { id: 2, email: "agent@quickdesk.com", password: "agent123", name: "Agent Smith", role: "agent" },
    { id: 3, email: "user@quickdesk.com", password: "user123", name: "John User", role: "user" },
  ]

  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  const cookieStore = await cookies()
  cookieStore.set("auth-token", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  redirect("/dashboard")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/login")
}
