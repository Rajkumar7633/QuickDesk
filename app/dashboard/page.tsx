"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"
import { getAuthUser } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser } = useRealtimeStore()

  useEffect(() => {
    if (!currentUser) {
      const user = getAuthUser()
      if (user) {
        setCurrentUser(user)
      } else {
        router.push("/login")
      }
    }
  }, [currentUser, setCurrentUser, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Please wait while we load your data...</p>
        </div>
      </div>
    )
  }

  return <RealtimeDashboard />
}
