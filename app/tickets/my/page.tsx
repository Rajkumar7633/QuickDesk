"use client"

import { TicketList } from "@/components/tickets/ticket-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRealtimeStore } from "@/lib/realtime-store"

export default function MyTicketsPage() {
  const { currentUser } = useRealtimeStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">View and manage all your support tickets</p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <TicketList userRole={currentUser?.role} userId={currentUser?.id} />
    </div>
  )
}
