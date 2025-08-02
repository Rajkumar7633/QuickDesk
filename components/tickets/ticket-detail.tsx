"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Clock, MessageSquare, ThumbsUp, ThumbsDown, User, Calendar, Tag, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRealtimeStore, type Ticket, type Comment } from "@/lib/enhanced-realtime-store"

interface TicketDetailProps {
  ticketId: number
}

export function TicketDetail({ ticketId }: TicketDetailProps) {
  const { tickets, updateTicket, addComment, getTicketComments, currentUser } = useRealtimeStore()
  const [newComment, setNewComment] = useState("")
  const [isInternal, setIsInternal] = useState(false)

  const ticket = tickets.find((t) => t.id === ticketId)
  const comments = getTicketComments(ticketId)

  if (!ticket) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">Ticket not found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The ticket you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleStatusChange = (newStatus: string) => {
    updateTicket(ticketId, { status: newStatus as Ticket["status"] })
  }

  const handlePriorityChange = (newPriority: string) => {
    updateTicket(ticketId, { priority: newPriority as Ticket["priority"] })
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return

    const comment: Comment = {
      id: Date.now(),
      ticketId,
      content: newComment,
      author: currentUser,
      createdAt: new Date().toISOString(),
      isInternal,
      attachments: [],
    }

    addComment(comment)
    setNewComment("")
    setIsInternal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSlaStatusColor = (slaStatus: string) => {
    switch (slaStatus) {
      case "on-track":
        return "text-green-600"
      case "at-risk":
        return "text-yellow-600"
      case "overdue":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                <span className="text-sm text-muted-foreground">#{ticket.id}</span>
              </div>
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <CardDescription>{ticket.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {ticket.upvotes}
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="h-4 w-4 mr-1" />
                {ticket.downvotes}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created by</p>
                <p className="text-sm text-muted-foreground">{ticket.createdBy.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned to</p>
                <p className="text-sm text-muted-foreground">{ticket.assignedTo?.name || "Unassigned"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`h-4 w-4 ${getSlaStatusColor(ticket.slaStatus)}`} />
              <div>
                <p className="text-sm font-medium">SLA Status</p>
                <p className={`text-sm ${getSlaStatusColor(ticket.slaStatus)}`}>{ticket.slaStatus.replace("-", " ")}</p>
              </div>
            </div>
          </div>

          {ticket.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {(currentUser?.role === "admin" || currentUser?.role === "agent") && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                      {comment.isInternal && (
                        <Badge variant="secondary" className="text-xs">
                          Internal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )}

          {/* Add Comment */}
          {currentUser && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center justify-between">
                    {(currentUser.role === "admin" || currentUser.role === "agent") && (
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded"
                        />
                        <span>Internal comment</span>
                      </label>
                    )}
                    <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
