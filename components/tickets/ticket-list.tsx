"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, MessageSquare, ThumbsUp, ThumbsDown, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

interface TicketListProps {
  showFilters?: boolean
  userRole?: string
  userId?: number
}

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function TicketList({ showFilters = true, userRole, userId }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")

  const { tickets, currentUser } = useRealtimeStore()

  // Filter tickets based on user role
  const userTickets = tickets.filter((ticket) => {
    if (userRole === "user" || (userId && currentUser?.role === "user")) {
      return ticket.createdBy.id === (userId || currentUser?.id)
    }
    return true // Agents and admins see all tickets
  })

  const filteredTickets = userTickets
    .filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes
        case "updatedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const isOverdue = (ticket: any) => {
    if (!ticket.dueDate) return false
    return new Date(ticket.dueDate) < new Date()
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Recently Created</SelectItem>
                  <SelectItem value="updatedAt">Recently Updated</SelectItem>
                  <SelectItem value="upvotes">Most Upvoted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No tickets found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating a new ticket"}
                </p>
                {userRole === "user" && (
                  <div className="mt-6">
                    <Link href="/tickets/new">
                      <Button>Create Your First Ticket</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={priorityColors[ticket.priority as keyof typeof priorityColors]}
                      >
                        {ticket.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">#{ticket.id}</span>
                      {isOverdue(ticket) && ticket.status !== "resolved" && ticket.status !== "closed" && (
                        <Badge variant="destructive" className="animate-pulse">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      {ticket.status === "resolved" && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>

                    <Link href={`/tickets/${ticket.id}`}>
                      <h3 className="text-lg font-semibold hover:text-primary cursor-pointer truncate">
                        {ticket.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                      <span>Category: {ticket.category}</span>
                      <span>By: {ticket.createdBy.name}</span>
                      <span>Created: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                      {ticket.updatedAt !== ticket.createdAt && (
                        <span>Updated: {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-1 text-sm">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span>{ticket.upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <span>{ticket.downvotes}</span>
                    </div>
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
