"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { TicketForm } from "@/components/tickets/ticket-form"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

export default function NewTicketPage() {
  const { currentUser } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Ticket</h1>
        <p className="text-muted-foreground">Submit a new support request and we'll help you resolve it quickly.</p>
      </div>

      <div className="flex justify-center">
        <TicketForm />
      </div>
    </div>
  )
}
