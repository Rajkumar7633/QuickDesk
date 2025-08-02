"use client"

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

interface Ticket {
  id: number
  subject: string
  description: string
  status: string
  priority: string
  category_id: number
  category_name?: string
  created_by: number
  created_by_name?: string
  assigned_to?: number
  assigned_to_name?: string
  upvotes: number
  downvotes: number
  created_at: string
  updated_at: string
  attachment_url?: string
  sla_due_date: string
}

interface Comment {
  id: number
  ticket_id: number
  user_id: number
  user_name: string
  user_role: string
  comment: string
  is_internal: boolean
  created_at: string
}

interface User {
  id: number
  email: string
  full_name: string
  role: string
  avatar_url?: string
  created_at: string
  is_active: boolean
  last_active?: string
  status?: "online" | "away" | "offline"
}

interface Category {
  id: number
  name: string
  description: string
  color: string
  is_active: boolean
  ticket_count: number
  created_at: string
}

interface Notification {
  id: number
  user_id: number
  ticket_id?: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  is_read: boolean
  created_at: string
}

interface Activity {
  id: number
  user_id: number
  user_name: string
  action: string
  target_type: "ticket" | "comment" | "user" | "category"
  target_id: number
  description: string
  created_at: string
}

interface RealtimeStore {
  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Tickets
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  updateTicket: (id: number, updates: Partial<Ticket>) => void
  deleteTicket: (id: number) => void

  // Comments
  comments: { [ticketId: number]: Comment[] }
  setComments: (ticketId: number, comments: Comment[]) => void
  addComment: (comment: Comment) => void

  // Users
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: number, updates: Partial<User>) => void
  deleteUser: (id: number) => void
  updateUserStatus: (id: number, status: "online" | "away" | "offline") => void

  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (id: number, updates: Partial<Category>) => void
  deleteCategory: (id: number) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: number) => void
  clearAllNotifications: () => void

  // Activities
  activities: Activity[]
  addActivity: (activity: Activity) => void

  // Real-time features
  isConnected: boolean
  setConnected: (connected: boolean) => void
  broadcastUpdate: (type: string, data: any) => void

  // Analytics
  getAnalytics: () => any

  // Real-time simulation
  simulateRealTimeUpdates: () => void
}

export const useRealtimeStore = create<RealtimeStore>()(
  subscribeWithSelector((set, get) => ({
    // Current user
    currentUser: null,
    setCurrentUser: (user) => {
      set({ currentUser: user })
      if (user) {
        get().updateUserStatus(user.id, "online")
      }
    },

    // Tickets
    tickets: [
      {
        id: 1,
        subject: "Login Issues - Cannot Access Account",
        description:
          "I'm unable to login to my account. Getting 'Invalid credentials' error even with correct password.",
        status: "open",
        priority: "high",
        category_id: 2,
        category_name: "Account Issues",
        created_by: 3,
        created_by_name: "John Doe",
        assigned_to: 2,
        assigned_to_name: "Support Agent",
        upvotes: 5,
        downvotes: 1,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        sla_due_date: new Date(Date.now() + 172800000).toISOString(),
      },
      {
        id: 2,
        subject: "Feature Request: Dark Mode Support",
        description: "Please add dark mode support to the application. It would greatly improve user experience.",
        status: "in_progress",
        priority: "medium",
        category_id: 4,
        category_name: "Feature Request",
        created_by: 4,
        created_by_name: "Jane Smith",
        assigned_to: 2,
        assigned_to_name: "Support Agent",
        upvotes: 12,
        downvotes: 2,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        sla_due_date: new Date(Date.now() + 259200000).toISOString(),
      },
      {
        id: 3,
        subject: "Application Crashes on Mobile",
        description: "The mobile app crashes whenever I try to upload files. This happens consistently.",
        status: "resolved",
        priority: "urgent",
        category_id: 5,
        category_name: "Bug Report",
        created_by: 3,
        created_by_name: "John Doe",
        assigned_to: 5,
        assigned_to_name: "Mike Wilson",
        upvotes: 8,
        downvotes: 0,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        sla_due_date: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    setTickets: (tickets) => set({ tickets }),
    addTicket: (ticket) => {
      set((state) => ({
        tickets: [ticket, ...state.tickets],
        categories: state.categories.map((cat) =>
          cat.id === ticket.category_id ? { ...cat, ticket_count: cat.ticket_count + 1 } : cat,
        ),
      }))

      // Add activity
      const activity = {
        id: Date.now(),
        user_id: ticket.created_by,
        user_name: ticket.created_by_name || "Unknown",
        action: "created",
        target_type: "ticket" as const,
        target_id: ticket.id,
        description: `Created ticket: ${ticket.subject}`,
        created_at: new Date().toISOString(),
      }
      get().addActivity(activity)

      // Notify agents and admins
      const agentNotification = {
        id: Date.now() + Math.random(),
        user_id: 0, // Broadcast to all agents/admins
        ticket_id: ticket.id,
        title: "New Ticket Created",
        message: `${ticket.priority.toUpperCase()} priority ticket: ${ticket.subject}`,
        type: "info" as const,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      get().addNotification(agentNotification)

      get().broadcastUpdate("ticket_created", ticket)
    },
    updateTicket: (id, updates) => {
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id ? { ...ticket, ...updates, updated_at: new Date().toISOString() } : ticket,
        ),
      }))

      const ticket = get().tickets.find((t) => t.id === id)
      if (ticket && updates.status) {
        // Add activity for status change
        const activity = {
          id: Date.now(),
          user_id: get().currentUser?.id || 0,
          user_name: get().currentUser?.full_name || "System",
          action: "updated",
          target_type: "ticket" as const,
          target_id: id,
          description: `Changed status to ${updates.status}`,
          created_at: new Date().toISOString(),
        }
        get().addActivity(activity)

        // Notify ticket creator
        const notification = {
          id: Date.now() + Math.random(),
          user_id: ticket.created_by,
          ticket_id: id,
          title: "Ticket Status Updated",
          message: `Your ticket #${id} status changed to ${updates.status.replace("_", " ")}`,
          type: "success" as const,
          is_read: false,
          created_at: new Date().toISOString(),
        }
        get().addNotification(notification)
      }

      get().broadcastUpdate("ticket_updated", { id, updates })
    },
    deleteTicket: (id) => {
      set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== id),
      }))
      get().broadcastUpdate("ticket_deleted", { id })
    },

    // Comments
    comments: {
      1: [
        {
          id: 1,
          ticket_id: 1,
          user_id: 2,
          user_name: "Support Agent",
          user_role: "agent",
          comment:
            "I've received your ticket and will look into this issue. Can you please try clearing your browser cache?",
          is_internal: false,
          created_at: new Date(Date.now() - 82800000).toISOString(),
        },
        {
          id: 2,
          ticket_id: 1,
          user_id: 3,
          user_name: "John Doe",
          user_role: "user",
          comment: "I tried clearing cache but still having the same issue.",
          is_internal: false,
          created_at: new Date(Date.now() - 79200000).toISOString(),
        },
      ],
      2: [
        {
          id: 3,
          ticket_id: 2,
          user_id: 2,
          user_name: "Support Agent",
          user_role: "agent",
          comment: "This is a great suggestion! We're currently working on implementing dark mode.",
          is_internal: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    },
    setComments: (ticketId, comments) =>
      set((state) => ({
        comments: { ...state.comments, [ticketId]: comments },
      })),
    addComment: (comment) => {
      set((state) => ({
        comments: {
          ...state.comments,
          [comment.ticket_id]: [...(state.comments[comment.ticket_id] || []), comment],
        },
      }))

      // Add activity
      const activity = {
        id: Date.now(),
        user_id: comment.user_id,
        user_name: comment.user_name,
        action: "commented",
        target_type: "ticket" as const,
        target_id: comment.ticket_id,
        description: `Added comment to ticket #${comment.ticket_id}`,
        created_at: new Date().toISOString(),
      }
      get().addActivity(activity)

      // Notify relevant users
      const ticket = get().tickets.find((t) => t.id === comment.ticket_id)
      if (ticket) {
        const notification = {
          id: Date.now() + Math.random(),
          user_id: comment.user_id === ticket.created_by ? ticket.assigned_to || 0 : ticket.created_by,
          ticket_id: comment.ticket_id,
          title: "New Comment",
          message: `${comment.user_name} commented on ticket #${comment.ticket_id}`,
          type: "info" as const,
          is_read: false,
          created_at: new Date().toISOString(),
        }
        get().addNotification(notification)
      }

      get().broadcastUpdate("comment_added", comment)
    },

    // Users
    users: [
      {
        id: 1,
        email: "admin@quickdesk.com",
        full_name: "System Administrator",
        role: "admin",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
        status: "online",
        last_active: new Date().toISOString(),
      },
      {
        id: 2,
        email: "agent@quickdesk.com",
        full_name: "Support Agent",
        role: "agent",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
        status: "online",
        last_active: new Date().toISOString(),
      },
      {
        id: 3,
        email: "user@quickdesk.com",
        full_name: "John Doe",
        role: "user",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
        status: "away",
        last_active: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 4,
        email: "jane.smith@company.com",
        full_name: "Jane Smith",
        role: "user",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_active: true,
        status: "offline",
        last_active: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 5,
        email: "mike.wilson@company.com",
        full_name: "Mike Wilson",
        role: "agent",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        is_active: true,
        status: "online",
        last_active: new Date().toISOString(),
      },
    ],
    setUsers: (users) => set({ users }),
    addUser: (user) => {
      set((state) => ({ users: [...state.users, user] }))
      get().broadcastUpdate("user_added", user)
    },
    updateUser: (id, updates) =>
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
      })),
    deleteUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    updateUserStatus: (id, status) => {
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status, last_active: new Date().toISOString() } : user,
        ),
      }))
    },

    // Categories
    categories: [
      {
        id: 1,
        name: "Technical Support",
        description: "Technical issues and troubleshooting",
        color: "#EF4444",
        is_active: true,
        ticket_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Account Issues",
        description: "Account-related problems and questions",
        color: "#F59E0B",
        is_active: true,
        ticket_count: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Billing",
        description: "Billing and payment related queries",
        color: "#10B981",
        is_active: true,
        ticket_count: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Feature Request",
        description: "Requests for new features or improvements",
        color: "#8B5CF6",
        is_active: true,
        ticket_count: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Bug Report",
        description: "Report bugs and issues in the system",
        color: "#F97316",
        is_active: true,
        ticket_count: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 6,
        name: "General Inquiry",
        description: "General questions and information requests",
        color: "#6B7280",
        is_active: true,
        ticket_count: 0,
        created_at: new Date().toISOString(),
      },
    ],
    setCategories: (categories) => set({ categories }),
    addCategory: (category) => {
      set((state) => ({ categories: [...state.categories, category] }))
      get().broadcastUpdate("category_added", category)
    },
    updateCategory: (id, updates) =>
      set((state) => ({
        categories: state.categories.map((category) => (category.id === id ? { ...category, ...updates } : category)),
      })),
    deleteCategory: (id) =>
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      })),

    // Notifications
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    addNotification: (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }))

      // Show browser notification if supported
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
        })
      }
    },
    markNotificationAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification,
        ),
      })),
    clearAllNotifications: () => set({ notifications: [] }),

    // Activities
    activities: [],
    addActivity: (activity) =>
      set((state) => ({
        activities: [activity, ...state.activities.slice(0, 99)], // Keep last 100 activities
      })),

    // Real-time features
    isConnected: true,
    setConnected: (connected) => set({ isConnected: connected }),
    broadcastUpdate: (type, data) => {
      // In a real app, this would send to WebSocket server
      console.log(`Broadcasting ${type}:`, data)
    },

    // Analytics
    getAnalytics: () => {
      const state = get()
      const now = new Date()
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      return {
        totalTickets: state.tickets.length,
        openTickets: state.tickets.filter((t) => t.status === "open").length,
        resolvedTickets: state.tickets.filter((t) => t.status === "resolved").length,
        avgResolutionTime: 24, // Mock data
        slaCompliance: 87,
        customerSatisfaction: 92,
        ticketsLast24h: state.tickets.filter((t) => new Date(t.created_at) > last24h).length,
        ticketsLast7d: state.tickets.filter((t) => new Date(t.created_at) > last7d).length,
        activeUsers: state.users.filter((u) => u.status === "online").length,
        categoryBreakdown: state.categories.map((cat) => ({
          name: cat.name,
          count: cat.ticket_count,
          color: cat.color,
        })),
        statusBreakdown: [
          { status: "open", count: state.tickets.filter((t) => t.status === "open").length },
          { status: "in_progress", count: state.tickets.filter((t) => t.status === "in_progress").length },
          { status: "resolved", count: state.tickets.filter((t) => t.status === "resolved").length },
          { status: "closed", count: state.tickets.filter((t) => t.status === "closed").length },
        ],
        priorityBreakdown: [
          { priority: "low", count: state.tickets.filter((t) => t.priority === "low").length },
          { priority: "medium", count: state.tickets.filter((t) => t.priority === "medium").length },
          { priority: "high", count: state.tickets.filter((t) => t.priority === "high").length },
          { priority: "urgent", count: state.tickets.filter((t) => t.priority === "urgent").length },
        ],
        recentActivities: state.activities.slice(0, 10),
      }
    },

    // Real-time simulation
    simulateRealTimeUpdates: () => {
      // Request notification permission
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }

      // Simulate ticket status updates
      setInterval(() => {
        const state = get()
        const openTickets = state.tickets.filter((t) => t.status === "open")
        if (openTickets.length > 0 && Math.random() > 0.7) {
          const randomTicket = openTickets[Math.floor(Math.random() * openTickets.length)]
          const newStatus = Math.random() > 0.5 ? "in_progress" : "resolved"
          state.updateTicket(randomTicket.id, { status: newStatus })
        }
      }, 15000) // Every 15 seconds

      // Simulate new comments
      setInterval(() => {
        const state = get()
        const activeTickets = state.tickets.filter((t) => t.status !== "closed")
        if (activeTickets.length > 0 && Math.random() > 0.8) {
          const randomTicket = activeTickets[Math.floor(Math.random() * activeTickets.length)]
          const agents = state.users.filter((u) => u.role === "agent")
          const randomAgent = agents[Math.floor(Math.random() * agents.length)]

          const comments = [
            "I'm working on this issue and will update you soon.",
            "Could you provide more details about this problem?",
            "I've escalated this to our technical team.",
            "This should be resolved now. Please check and confirm.",
            "Thank you for your patience while we investigate.",
          ]

          const comment = {
            id: Date.now(),
            ticket_id: randomTicket.id,
            user_id: randomAgent.id,
            user_name: randomAgent.full_name,
            user_role: randomAgent.role,
            comment: comments[Math.floor(Math.random() * comments.length)],
            is_internal: false,
            created_at: new Date().toISOString(),
          }

          state.addComment(comment)
        }
      }, 20000) // Every 20 seconds

      // Simulate user status changes
      setInterval(() => {
        const state = get()
        const users = state.users.filter((u) => u.id !== state.currentUser?.id)
        if (users.length > 0 && Math.random() > 0.9) {
          const randomUser = users[Math.floor(Math.random() * users.length)]
          const statuses = ["online", "away", "offline"] as const
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          state.updateUserStatus(randomUser.id, newStatus)
        }
      }, 30000) // Every 30 seconds

      // Simulate new tickets (less frequent)
      setInterval(() => {
        const state = get()
        if (Math.random() > 0.95) {
          const subjects = [
            "Password Reset Request",
            "Unable to Upload Files",
            "Payment Processing Error",
            "Feature Enhancement Request",
            "Mobile App Crash",
            "Email Notification Issues",
          ]

          const descriptions = [
            "I need help resetting my password as I can't access my account.",
            "The file upload feature is not working properly on my browser.",
            "I'm getting an error when trying to process payments.",
            "Could you please add a dark mode option to the interface?",
            "The mobile application keeps crashing when I try to use it.",
            "I'm not receiving email notifications for my tickets.",
          ]

          const users = state.users.filter((u) => u.role === "user")
          const randomUser = users[Math.floor(Math.random() * users.length)]
          const categories = state.categories.filter((c) => c.is_active)
          const randomCategory = categories[Math.floor(Math.random() * categories.length)]
          const priorities = ["low", "medium", "high", "urgent"]
          const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
          const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

          const newTicket = {
            id: Date.now(),
            subject: randomSubject,
            description: randomDescription,
            status: "open",
            priority: randomPriority,
            category_id: randomCategory.id,
            category_name: randomCategory.name,
            created_by: randomUser.id,
            created_by_name: randomUser.full_name,
            assigned_to: undefined,
            assigned_to_name: "Unassigned",
            upvotes: 0,
            downvotes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sla_due_date: new Date(
              Date.now() + (randomPriority === "urgent" ? 86400000 : randomPriority === "high" ? 172800000 : 259200000),
            ).toISOString(),
          }

          state.addTicket(newTicket)
        }
      }, 45000) // Every 45 seconds
    },
  })),
)
