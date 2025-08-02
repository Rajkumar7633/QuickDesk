"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserManagement } from "@/components/admin/user-management"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

export default function UsersPage() {
  const { currentUser } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "admin") {
      router.push("/unauthorized")
      return
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UserManagement />
    </div>
  )
}
