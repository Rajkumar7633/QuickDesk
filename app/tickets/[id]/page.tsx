"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { TicketDetail } from "@/components/tickets/ticket-detail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRealtimeStore } from "@/lib/realtime-store"

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = Number(params.id)
  const [loading, setLoading] = useState(false)

  const { tickets, comments, currentUser, updateTicket, addComment } = useRealtimeStore()

  const ticket = tickets.find((t) => t.id === ticketId)
  const ticketComments = comments[ticketId] || []

  const mockCurrentUser = currentUser || {
    id: 2,
    role: "agent",
    full_name: "Support Agent",
  }

  const handleUpdateStatus = async (status: string) => {
    if (ticket) {
      updateTicket(ticket.id, { status })
    }
  }

  const handleAddComment = async (comment: string, isInternal: boolean) => {
    if (!currentUser) return

    const newComment = {
      id: Date.now(),
      ticket_id: ticketId,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      comment,
      is_internal: isInternal,
      created_at: new Date().toISOString(),
    }
    addComment(newComment)
  }

  const handleVote = async (voteType: "up" | "down") => {
    if (ticket) {
      updateTicket(ticket.id, {
        upvotes: voteType === "up" ? ticket.upvotes + 1 : ticket.upvotes,
        downvotes: voteType === "down" ? ticket.downvotes + 1 : ticket.downvotes,
      })
    }
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ticket Not Found</h3>
            <p className="text-muted-foreground">The ticket you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TicketDetail
        ticket={ticket}
        comments={ticketComments}
        currentUser={mockCurrentUser}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        onVote={handleVote}
      />
    </div>
  )
}
