"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { RealtimeIndicator } from "@/components/layout/realtime-indicator"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { currentUser, setConnected, simulateRealTimeUpdates } = useRealtimeStore()

  const isAuthPage = pathname === "/login" || pathname === "/"
  const showLayout = currentUser && !isAuthPage

  useEffect(() => {
    // Simulate real-time connection
    setConnected(true)
    const cleanup = simulateRealTimeUpdates()

    return cleanup
  }, [setConnected, simulateRealTimeUpdates])

  if (isAuthPage) {
    return <>{children}</>
  }

  if (!currentUser) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <RealtimeIndicator />
    </div>
  )
}
