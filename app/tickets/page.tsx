"use client"

import { TicketList } from "@/components/tickets/ticket-list"
import { useRealtimeStore } from "@/lib/realtime-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AllTicketsPage() {
  const { currentUser } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    // Only agents and admins can access this page
    if (currentUser && !["agent", "admin"].includes(currentUser.role)) {
      router.push("/tickets/my")
    }
  }, [currentUser, router])

  if (!currentUser || !["agent", "admin"].includes(currentUser.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Tickets</h1>
        <p className="text-muted-foreground">Manage and respond to all support tickets in the system</p>
      </div>

      <TicketList />
    </div>
  )
}
