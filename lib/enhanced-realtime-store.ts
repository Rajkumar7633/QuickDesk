"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "agent" | "user"
  avatar?: string
  status: "online" | "away" | "offline"
  lastActive: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  categoryColor: string
  assignedTo?: User
  createdBy: User
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  upvotes: number
  downvotes: number
  slaStatus: "on-track" | "at-risk" | "overdue"
  estimatedResolution?: string
  comments: Comment[]
  attachments: Attachment[]
}

export interface Comment {
  id: number
  ticketId: number
  content: string
  author: User
  createdAt: string
  isInternal: boolean
  attachments: Attachment[]
}

export interface Attachment {
  id: number
  name: string
  url: string
  type: string
  size: number
  uploadedBy: User
  uploadedAt: string
}

export interface Category {
  id: number
  name: string
  description: string
  color: string
  ticketCount: number
  isActive: boolean
}

export interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
  userId: number
  ticketId?: number
  actionUrl?: string
}

export interface KnowledgeArticle {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  author: User
  createdAt: string
  updatedAt: string
  views: number
  rating: number
  ratingCount: number
  isFeatured: boolean
  isPublished: boolean
}

export interface EmailTemplate {
  id: number
  name: string
  subject: string
  content: string
  variables: string[]
  trigger: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface TicketTemplate {
  id: number
  name: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
  isActive: boolean
  usageCount: number
  isFeatured: boolean
}

export interface Activity {
  id: number
  type: "ticket_created" | "ticket_updated" | "comment_added" | "user_login" | "user_logout"
  description: string
  userId: number
  userName: string
  ticketId?: number
  createdAt: string
  metadata?: Record<string, any>
}

interface RealtimeStore {
  // User management
  currentUser: User | null
  users: User[]
  setCurrentUser: (user: User | null) => void
  updateUserStatus: (userId: number, status: User["status"]) => void
  addUser: (user: User) => void
  updateUser: (userId: number, updates: Partial<User>) => void
  deleteUser: (userId: number) => void

  // Tickets
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  updateTicket: (ticketId: number, updates: Partial<Ticket>) => void
  deleteTicket: (ticketId: number) => void

  // Comments
  comments: Comment[]
  addComment: (comment: Comment) => void
  updateComment: (commentId: number, updates: Partial<Comment>) => void
  deleteComment: (commentId: number) => void
  getTicketComments: (ticketId: number) => Comment[]

  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (categoryId: number, updates: Partial<Category>) => void
  deleteCategory: (categoryId: number) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (notificationId: number) => void
  markAllNotificationsAsRead: () => void
  clearNotifications: () => void

  // Knowledge Base
  knowledgeArticles: KnowledgeArticle[]
  setKnowledgeArticles: (articles: KnowledgeArticle[]) => void
  addKnowledgeArticle: (article: KnowledgeArticle) => void
  updateKnowledgeArticle: (articleId: number, updates: Partial<KnowledgeArticle>) => void
  deleteKnowledgeArticle: (articleId: number) => void

  // Email Templates
  emailTemplates: EmailTemplate[]
  setEmailTemplates: (templates: EmailTemplate[]) => void
  addEmailTemplate: (template: EmailTemplate) => void
  updateEmailTemplate: (templateId: number, updates: Partial<EmailTemplate>) => void
  deleteEmailTemplate: (templateId: number) => void

  // Ticket Templates
  ticketTemplates: TicketTemplate[]
  setTicketTemplates: (templates: TicketTemplate[]) => void
  addTicketTemplate: (template: TicketTemplate) => void
  updateTicketTemplate: (templateId: number, updates: Partial<TicketTemplate>) => void
  deleteTicketTemplate: (templateId: number) => void

  // Activities
  activities: Activity[]
  addActivity: (activity: Activity) => void
  getRecentActivities: (limit?: number) => Activity[]

  // Real-time connection
  isConnected: boolean
  setConnected: (connected: boolean) => void
  simulateRealTimeUpdates: () => () => void

  // Analytics
  getAnalytics: () => {
    totalTickets: number
    openTickets: number
    resolvedTickets: number
    ticketsLast24h: number
    avgResolutionTime: number
    customerSatisfaction: number
    slaCompliance: number
    activeUsers: number
    statusBreakdown: Array<{ status: string; count: number }>
    priorityBreakdown: Array<{ priority: string; count: number }>
    categoryBreakdown: Array<{ name: string; count: number; color: string }>
  }
}

// Sample data with dynamic generation
const generateSampleUsers = (): User[] => [
  {
    id: 1,
    name: "Admin User",
    email: "admin@quickdesk.com",
    role: "admin",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=AU",
  },
  {
    id: 2,
    name: "Agent Smith",
    email: "agent@quickdesk.com",
    role: "agent",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=AS",
  },
  {
    id: 3,
    name: "John User",
    email: "user@quickdesk.com",
    role: "user",
    status: "away",
    lastActive: new Date(Date.now() - 300000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=JU",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@quickdesk.com",
    role: "agent",
    status: "online",
    lastActive: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
  },
  {
    id: 5,
    name: "Mike Wilson",
    email: "mike@quickdesk.com",
    role: "user",
    status: "offline",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40&text=MW",
  },
]

const generateSampleCategories = (): Category[] => [
  {
    id: 1,
    name: "Technical Support",
    description: "Hardware and software issues",
    color: "#3b82f6",
    ticketCount: 0,
    isActive: true,
  },
  {
    id: 2,
    name: "Billing",
    description: "Payment and subscription issues",
    color: "#10b981",
    ticketCount: 0,
    isActive: true,
  },
  {
    id: 3,
    name: "Feature Request",
    description: "New feature suggestions",
    color: "#f59e0b",
    ticketCount: 0,
    isActive: true,
  },
  {
    id: 4,
    name: "Bug Report",
    description: "Software bugs and errors",
    color: "#ef4444",
    ticketCount: 0,
    isActive: true,
  },
  {
    id: 5,
    name: "Account Management",
    description: "User account related issues",
    color: "#8b5cf6",
    ticketCount: 0,
    isActive: true,
  },
]

const generateSampleTickets = (users: User[], categories: Category[]): Ticket[] => {
  const sampleTitles = [
    "Login issues with mobile app",
    "Payment processing error",
    "Feature request: Dark mode",
    "Bug: Dashboard not loading",
    "Password reset not working",
    "Slow performance on reports page",
    "Email notifications not received",
    "Unable to upload attachments",
    "Search functionality broken",
    "Integration with third-party tools",
  ]

  const sampleDescriptions = [
    "Users are experiencing login failures on the mobile application. The error occurs when trying to authenticate with valid credentials.",
    "Credit card payments are failing during checkout process. Multiple users have reported this issue in the last 24 hours.",
    "Request to add dark mode theme option to improve user experience during night time usage.",
    "Dashboard page shows loading spinner indefinitely and never displays the actual content.",
    "Password reset emails are not being sent to users when they request password changes.",
    "Reports page takes more than 30 seconds to load, causing timeout issues for users.",
    "Users are not receiving email notifications for ticket updates and new assignments.",
    "File upload functionality is not working properly, showing error messages for valid file types.",
    "Search feature returns no results even when searching for existing tickets and content.",
    "Need integration capabilities with popular tools like Slack, Teams, and Jira for better workflow.",
  ]

  return Array.from({ length: 15 }, (_, index) => {
    const createdBy = users[Math.floor(Math.random() * users.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const assignedTo = Math.random() > 0.3 ? users.find((u) => u.role === "agent") : undefined
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString()

    const statuses: Ticket["status"][] = ["open", "in-progress", "resolved", "closed"]
    const priorities: Ticket["priority"][] = ["low", "medium", "high", "urgent"]
    const slaStatuses: Ticket["slaStatus"][] = ["on-track", "at-risk", "overdue"]

    return {
      id: index + 1,
      title: sampleTitles[index % sampleTitles.length],
      description: sampleDescriptions[index % sampleDescriptions.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: category.name,
      categoryColor: category.color,
      assignedTo,
      createdBy,
      createdAt,
      updatedAt,
      tags: ["bug", "urgent", "mobile", "payment"].slice(0, Math.floor(Math.random() * 3) + 1),
      upvotes: Math.floor(Math.random() * 10),
      downvotes: Math.floor(Math.random() * 3),
      slaStatus: slaStatuses[Math.floor(Math.random() * slaStatuses.length)],
      comments: [],
      attachments: [],
    }
  })
}

const generateSampleActivities = (users: User[]): Activity[] => {
  const activities: Activity[] = []
  const activityTypes: Activity["type"][] = ["ticket_created", "ticket_updated", "comment_added", "user_login"]

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]

    let description = ""
    switch (type) {
      case "ticket_created":
        description = "created a new ticket"
        break
      case "ticket_updated":
        description = "updated ticket status"
        break
      case "comment_added":
        description = "added a comment to ticket"
        break
      case "user_login":
        description = "logged into the system"
        break
    }

    activities.push({
      id: i + 1,
      type,
      description,
      userId: user.id,
      userName: user.name,
      ticketId: type.includes("ticket") ? Math.floor(Math.random() * 15) + 1 : undefined,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const useRealtimeStore = create<RealtimeStore>()(
  persist(
    (set, get) => {
      const initialUsers = generateSampleUsers()
      const initialCategories = generateSampleCategories()
      const initialTickets = generateSampleTickets(initialUsers, initialCategories)
      const initialActivities = generateSampleActivities(initialUsers)

      return {
        // User management
        currentUser: null,
        users: initialUsers,
        setCurrentUser: (user) => {
          set({ currentUser: user })
          if (user) {
            get().addActivity({
              id: Date.now(),
              type: "user_login",
              description: "logged into the system",
              userId: user.id,
              userName: user.name,
              createdAt: new Date().toISOString(),
            })
          }
        },
        updateUserStatus: (userId, status) =>
          set((state) => ({
            users: state.users.map((user) =>
              user.id === userId ? { ...user, status, lastActive: new Date().toISOString() } : user,
            ),
          })),
        addUser: (user) =>
          set((state) => ({
            users: [...state.users, user],
          })),
        updateUser: (userId, updates) =>
          set((state) => ({
            users: state.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
          })),
        deleteUser: (userId) =>
          set((state) => ({
            users: state.users.filter((user) => user.id !== userId),
          })),

        // Tickets
        tickets: initialTickets,
        setTickets: (tickets) => set({ tickets }),
        addTicket: (ticket) => {
          set((state) => ({
            tickets: [ticket, ...state.tickets],
          }))
          get().addActivity({
            id: Date.now(),
            type: "ticket_created",
            description: `created ticket "${ticket.title}"`,
            userId: ticket.createdBy.id,
            userName: ticket.createdBy.name,
            ticketId: ticket.id,
            createdAt: new Date().toISOString(),
          })
          get().addNotification({
            id: Date.now(),
            title: "New Ticket Created",
            message: `Ticket "${ticket.title}" has been created`,
            type: "info",
            isRead: false,
            createdAt: new Date().toISOString(),
            userId: ticket.createdBy.id,
            ticketId: ticket.id,
          })
        },
        updateTicket: (ticketId, updates) => {
          set((state) => ({
            tickets: state.tickets.map((ticket) =>
              ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
            ),
          }))
          const ticket = get().tickets.find((t) => t.id === ticketId)
          if (ticket && updates.status) {
            get().addActivity({
              id: Date.now(),
              type: "ticket_updated",
              description: `updated ticket status to "${updates.status}"`,
              userId: get().currentUser?.id || 1,
              userName: get().currentUser?.name || "System",
              ticketId,
              createdAt: new Date().toISOString(),
            })
          }
        },
        deleteTicket: (ticketId) =>
          set((state) => ({
            tickets: state.tickets.filter((ticket) => ticket.id !== ticketId),
          })),

        // Comments
        comments: [],
        addComment: (comment) => {
          set((state) => ({
            comments: [...state.comments, comment],
          }))
          get().addActivity({
            id: Date.now(),
            type: "comment_added",
            description: `added a comment to ticket`,
            userId: comment.author.id,
            userName: comment.author.name,
            ticketId: comment.ticketId,
            createdAt: new Date().toISOString(),
          })
        },
        updateComment: (commentId, updates) =>
          set((state) => ({
            comments: state.comments.map((comment) =>
              comment.id === commentId ? { ...comment, ...updates } : comment,
            ),
          })),
        deleteComment: (commentId) =>
          set((state) => ({
            comments: state.comments.filter((comment) => comment.id !== commentId),
          })),
        getTicketComments: (ticketId) => {
          return get().comments.filter((comment) => comment.ticketId === ticketId)
        },

        // Categories
        categories: initialCategories,
        setCategories: (categories) => set({ categories }),
        addCategory: (category) =>
          set((state) => ({
            categories: [...state.categories, category],
          })),
        updateCategory: (categoryId, updates) =>
          set((state) => ({
            categories: state.categories.map((category) =>
              category.id === categoryId ? { ...category, ...updates } : category,
            ),
          })),
        deleteCategory: (categoryId) =>
          set((state) => ({
            categories: state.categories.filter((category) => category.id !== categoryId),
          })),

        // Notifications
        notifications: [],
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications.slice(0, 49)], // Keep only 50 notifications
          })),
        markNotificationAsRead: (notificationId) =>
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId ? { ...notification, isRead: true } : notification,
            ),
          })),
        markAllNotificationsAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((notification) => ({ ...notification, isRead: true })),
          })),
        clearNotifications: () => set({ notifications: [] }),

        // Knowledge Base
        knowledgeArticles: [
          {
            id: 1,
            title: "How to Reset Your Password",
            content:
              "Follow these steps to reset your password: 1. Go to login page 2. Click 'Forgot Password' 3. Enter your email 4. Check your email for reset link 5. Follow the instructions in the email",
            category: "Account Management",
            tags: ["password", "account", "security"],
            author: initialUsers[1],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 245,
            rating: 4.5,
            ratingCount: 12,
            isFeatured: true,
            isPublished: true,
          },
          {
            id: 2,
            title: "How to Create a New Ticket",
            content:
              "Creating a new support ticket is easy: 1. Click the 'New Ticket' button 2. Fill in the title and description 3. Select appropriate category and priority 4. Add any relevant tags 5. Submit the ticket",
            category: "Getting Started",
            tags: ["tickets", "support", "help"],
            author: initialUsers[1],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 189,
            rating: 4.8,
            ratingCount: 8,
            isFeatured: true,
            isPublished: true,
          },
        ],
        setKnowledgeArticles: (articles) => set({ knowledgeArticles: articles }),
        addKnowledgeArticle: (article) =>
          set((state) => ({
            knowledgeArticles: [article, ...state.knowledgeArticles],
          })),
        updateKnowledgeArticle: (articleId, updates) =>
          set((state) => ({
            knowledgeArticles: state.knowledgeArticles.map((article) =>
              article.id === articleId ? { ...article, ...updates, updatedAt: new Date().toISOString() } : article,
            ),
          })),
        deleteKnowledgeArticle: (articleId) =>
          set((state) => ({
            knowledgeArticles: state.knowledgeArticles.filter((article) => article.id !== articleId),
          })),

        // Email Templates
        emailTemplates: [
          {
            id: 1,
            name: "Ticket Created",
            subject: "Your ticket #{ticketId} has been created",
            content:
              "Hello {customerName},\n\nYour support ticket has been created successfully.\n\nTicket ID: #{ticketId}\nTitle: {ticketTitle}\nPriority: {ticketPriority}\n\nWe will respond to your ticket within our SLA timeframe.\n\nBest regards,\nQuickDesk Support Team",
            variables: ["ticketId", "customerName", "ticketTitle", "ticketPriority"],
            trigger: "ticket_created",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 156,
          },
          {
            id: 2,
            name: "Ticket Resolved",
            subject: "Your ticket #{ticketId} has been resolved",
            content:
              "Hello {customerName},\n\nGreat news! Your support ticket has been resolved.\n\nTicket ID: #{ticketId}\nTitle: {ticketTitle}\nResolution: {resolution}\n\nIf you have any questions or the issue persists, please don't hesitate to reopen this ticket.\n\nBest regards,\nQuickDesk Support Team",
            variables: ["ticketId", "customerName", "ticketTitle", "resolution"],
            trigger: "ticket_resolved",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 89,
          },
        ],
        setEmailTemplates: (templates) => set({ emailTemplates: templates }),
        addEmailTemplate: (template) =>
          set((state) => ({
            emailTemplates: [template, ...state.emailTemplates],
          })),
        updateEmailTemplate: (templateId, updates) =>
          set((state) => ({
            emailTemplates: state.emailTemplates.map((template) =>
              template.id === templateId ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template,
            ),
          })),
        deleteEmailTemplate: (templateId) =>
          set((state) => ({
            emailTemplates: state.emailTemplates.filter((template) => template.id !== templateId),
          })),

        // Ticket Templates
        ticketTemplates: [
          {
            id: 1,
            name: "Password Reset Request",
            title: "Password Reset Request",
            description:
              "User is unable to access their account and needs a password reset. Please verify the user's identity and provide instructions for resetting their password.",
            category: "Account Management",
            priority: "medium",
            tags: ["password", "account", "access"],
            isActive: true,
            usageCount: 45,
            isFeatured: true,
          },
          {
            id: 2,
            name: "Software Bug Report",
            title: "Software Bug Report",
            description:
              "A bug has been identified in the software. Please provide detailed steps to reproduce the issue, expected behavior, and actual behavior observed.",
            category: "Bug Report",
            priority: "high",
            tags: ["bug", "software", "error"],
            isActive: true,
            usageCount: 32,
            isFeatured: true,
          },
        ],
        setTicketTemplates: (templates) => set({ ticketTemplates: templates }),
        addTicketTemplate: (template) =>
          set((state) => ({
            ticketTemplates: [template, ...state.ticketTemplates],
          })),
        updateTicketTemplate: (templateId, updates) =>
          set((state) => ({
            ticketTemplates: state.ticketTemplates.map((template) =>
              template.id === templateId ? { ...template, ...updates } : template,
            ),
          })),
        deleteTicketTemplate: (templateId) =>
          set((state) => ({
            ticketTemplates: state.ticketTemplates.filter((template) => template.id !== templateId),
          })),

        // Activities
        activities: initialActivities,
        addActivity: (activity) =>
          set((state) => ({
            activities: [activity, ...state.activities.slice(0, 99)], // Keep only 100 activities
          })),
        getRecentActivities: (limit = 10) => {
          return get().activities.slice(0, limit)
        },

        // Real-time connection
        isConnected: false,
        setConnected: (connected) => set({ isConnected: connected }),
        simulateRealTimeUpdates: () => {
          let intervalId: NodeJS.Timeout

          const startSimulation = () => {
            intervalId = setInterval(() => {
              const state = get()
              if (!state.isConnected) {
                clearInterval(intervalId)
                return
              }

              // Simulate random ticket updates (30% chance)
              if (Math.random() < 0.3 && state.tickets.length > 0) {
                const randomTicket = state.tickets[Math.floor(Math.random() * state.tickets.length)]
                const statuses: Ticket["status"][] = ["open", "in-progress", "resolved", "closed"]
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
                if (randomTicket.status !== newStatus) {
                  state.updateTicket(randomTicket.id, { status: newStatus })
                }
              }

              // Simulate user status changes (20% chance)
              if (Math.random() < 0.2) {
                const randomUser = state.users[Math.floor(Math.random() * state.users.length)]
                const statuses: User["status"][] = ["online", "away", "offline"]
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
                if (randomUser.status !== newStatus) {
                  state.updateUserStatus(randomUser.id, newStatus)
                }
              }

              // Simulate new notifications (10% chance)
              if (Math.random() < 0.1) {
                const notifications = [
                  "New ticket assigned to you",
                  "Ticket status updated",
                  "New comment on your ticket",
                  "SLA deadline approaching",
                  "System maintenance scheduled",
                  "New knowledge base article published",
                ]
                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
                state.addNotification({
                  id: Date.now(),
                  title: "System Update",
                  message: randomNotification,
                  type: "info",
                  isRead: false,
                  createdAt: new Date().toISOString(),
                  userId: state.currentUser?.id || 0,
                })
              }

              // Simulate new activities (15% chance)
              if (Math.random() < 0.15) {
                const randomUser = state.users[Math.floor(Math.random() * state.users.length)]
                const activities = ["viewed dashboard", "updated profile", "searched knowledge base", "exported report"]
                const randomActivity = activities[Math.floor(Math.random() * activities.length)]
                state.addActivity({
                  id: Date.now(),
                  type: "user_login", // Generic type for these activities
                  description: randomActivity,
                  userId: randomUser.id,
                  userName: randomUser.name,
                  createdAt: new Date().toISOString(),
                })
              }
            }, 5000) // Update every 5 seconds
          }

          startSimulation()
          return () => clearInterval(intervalId)
        },

        // Analytics
        getAnalytics: () => {
          const state = get()
          const tickets = state.tickets
          const users = state.users

          const now = new Date()
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          const ticketsLast24h = tickets.filter((t) => new Date(t.createdAt) > yesterday).length

          // Status breakdown
          const statusBreakdown = [
            { status: "open", count: tickets.filter((t) => t.status === "open").length },
            { status: "in-progress", count: tickets.filter((t) => t.status === "in-progress").length },
            { status: "resolved", count: tickets.filter((t) => t.status === "resolved").length },
            { status: "closed", count: tickets.filter((t) => t.status === "closed").length },
          ]

          // Priority breakdown
          const priorityBreakdown = [
            { priority: "low", count: tickets.filter((t) => t.priority === "low").length },
            { priority: "medium", count: tickets.filter((t) => t.priority === "medium").length },
            { priority: "high", count: tickets.filter((t) => t.priority === "high").length },
            { priority: "urgent", count: tickets.filter((t) => t.priority === "urgent").length },
          ]

          // Category breakdown
          const categoryBreakdown = state.categories.map((category) => ({
            name: category.name,
            count: tickets.filter((t) => t.category === category.name).length,
            color: category.color,
          }))

          return {
            totalTickets: tickets.length,
            openTickets: tickets.filter((t) => t.status === "open").length,
            resolvedTickets: tickets.filter((t) => t.status === "resolved").length,
            ticketsLast24h,
            avgResolutionTime: Math.floor(Math.random() * 24) + 12, // Mock data: 12-36 hours
            customerSatisfaction: Math.floor(Math.random() * 20) + 80, // Mock data: 80-100%
            slaCompliance: Math.floor(Math.random() * 15) + 85, // Mock data: 85-100%
            activeUsers: users.filter((u) => u.status === "online").length,
            statusBreakdown,
            priorityBreakdown,
            categoryBreakdown,
          }
        },
      }
    },
    {
      name: "quickdesk-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        tickets: state.tickets,
        categories: state.categories,
        knowledgeArticles: state.knowledgeArticles,
        emailTemplates: state.emailTemplates,
        ticketTemplates: state.ticketTemplates,
        users: state.users,
        comments: state.comments,
        activities: state.activities,
      }),
    },
  ),
)
