"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle } from "lucide-react"
import { useRealtimeStore, type Ticket } from "@/lib/enhanced-realtime-store"

export function TicketForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { categories, currentUser, addTicket, addNotification } = useRealtimeStore()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const formData = new FormData(event.currentTarget)
      const subject = formData.get("subject") as string
      const description = formData.get("description") as string
      const category_id = Number.parseInt(formData.get("category_id") as string)
      const priority = (formData.get("priority") as string) || "medium"

      if (!subject || !description || !category_id) {
        setError("Subject, description, and category are required")
        return
      }

      if (!currentUser) {
        setError("You must be logged in to create a ticket")
        return
      }

      const category = categories.find((c) => c.id === category_id)

      const newTicket: Ticket = {
        id: Date.now(),
        title: subject,
        description,
        status: "open",
        priority: priority as Ticket["priority"],
        category: category?.name || "Unknown",
        categoryColor: category?.color || "#3b82f6",
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        upvotes: 0,
        downvotes: 0,
        slaStatus: "on-track",
        comments: [],
        attachments: [],
      }

      // Add ticket to store
      addTicket(newTicket)

      // Create notification for agents
      const agentNotification = {
        id: Date.now() + 1,
        user_id: 0, // Will be handled by agents
        ticket_id: newTicket.id,
        title: "New Ticket Created",
        message: `New ${priority} priority ticket: ${subject}`,
        type: "info" as const,
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: 0,
        ticketId: newTicket.id,
      }
      addNotification(agentNotification)

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/tickets/my")
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ticket Created Successfully!</h3>
          <p className="text-muted-foreground text-center mb-4">
            Your ticket has been submitted and assigned a unique ID. You'll be redirected to your tickets page.
          </p>
          <div className="animate-pulse text-sm text-muted-foreground">Redirecting in 2 seconds...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Ticket</CardTitle>
        <CardDescription>Describe your issue or request and we'll help you resolve it</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Brief description of your issue"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category_id" required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat.isActive)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue="medium" disabled={isLoading}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about your issue..."
              className="min-h-[120px]"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="attachment"
                name="attachment"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                disabled={isLoading}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF, DOC, DOCX (max 10MB)</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Ticket
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
