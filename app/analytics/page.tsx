"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { useRealtimeStore } from "@/lib/realtime-store"

export default function AnalyticsPage() {
  const { currentUser, setCurrentUser, users } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    // Set a default agent user if no user is logged in (for demo purposes)
    if (!currentUser) {
      const defaultAgent = users.find(user => user.role === "agent")
      if (defaultAgent) {
        setCurrentUser(defaultAgent)
      }
    }
  }, [currentUser, setCurrentUser, users])

  useEffect(() => {
    // Only agents and admins can access analytics
    if (currentUser && !["agent", "admin"].includes(currentUser.role)) {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your session</p>
        </div>
      </div>
    )
  }

  if (!["agent", "admin"].includes(currentUser.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your help desk performance</p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
