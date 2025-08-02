"use client"

import type { User } from "@/lib/enhanced-realtime-store"

const AUTH_KEY = "quickdesk_auth"

// Demo users with complete data
const demoUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@quickdesk.com",
    role: "admin",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=AU",
  },
  {
    id: 2,
    name: "Agent Smith",
    email: "agent@quickdesk.com",
    role: "agent",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=AS",
  },
  {
    id: 3,
    name: "John User",
    email: "user@quickdesk.com",
    role: "user",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=JU",
  },
]

const demoCredentials = {
  "admin@quickdesk.com": "admin123",
  "agent@quickdesk.com": "agent123",
  "user@quickdesk.com": "user123",
}

export function authenticateUser(email: string, password: string): User | null {
  const expectedPassword = demoCredentials[email as keyof typeof demoCredentials]

  if (expectedPassword && password === expectedPassword) {
    const user = demoUsers.find((u) => u.email === email)
    if (user) {
      const authenticatedUser = { ...user, status: "online" as const, lastActive: new Date().toISOString() }
      localStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser))
      return authenticatedUser
    }
  }

  return null
}

export function getAuthUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      const user = JSON.parse(stored)
      // Update last active time
      user.lastActive = new Date().toISOString()
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      return user
    }
  } catch (error) {
    console.error("Error getting auth user:", error)
    localStorage.removeItem(AUTH_KEY)
  }

  return null
}

export function clearAuthUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function updateAuthUser(updates: Partial<User>): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      const user = JSON.parse(stored)
      const updatedUser = { ...user, ...updates, lastActive: new Date().toISOString() }
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser))
      return updatedUser
    }
  } catch (error) {
    console.error("Error updating auth user:", error)
  }

  return null
}
