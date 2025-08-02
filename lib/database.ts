"use client"

// Database connection and query utilities
export interface DatabaseRow {
  [key: string]: any
}

// Client-side mock database for demo purposes
// In production, you would use a real database connection
class MockDatabase {
  private data = {
    users: [
      {
        id: 1,
        email: "admin@quickdesk.com",
        full_name: "System Administrator",
        role: "admin",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
      },
      {
        id: 2,
        email: "agent@quickdesk.com",
        full_name: "Support Agent",
        role: "agent",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
      },
      {
        id: 3,
        email: "user@quickdesk.com",
        full_name: "John Doe",
        role: "user",
        avatar_url: "/placeholder.svg?height=40&width=40",
        created_at: new Date().toISOString(),
        is_active: true,
      },
    ],
    categories: [
      {
        id: 1,
        name: "Technical Support",
        description: "Technical issues and troubleshooting",
        color: "#EF4444",
        is_active: true,
        ticket_count: 0,
      },
      {
        id: 2,
        name: "Account Issues",
        description: "Account-related problems and questions",
        color: "#F59E0B",
        is_active: true,
        ticket_count: 1,
      },
    ],
    tickets: [],
    comments: [],
  }

  async query(sql: string, params: any[] = []): Promise<DatabaseRow[]> {
    // Handle different query types
    if (sql.includes("SELECT * FROM users WHERE email = $1")) {
      return this.data.users.filter((u) => u.email === params[0])
    }

    if (sql.includes("SELECT * FROM users") && !sql.includes("WHERE")) {
      return this.data.users
    }

    if (sql.includes("SELECT * FROM categories")) {
      return this.data.categories
    }

    // Enhanced ticket queries
    if (
      sql.includes(
        "SELECT t.*, c.name as category_name, u.full_name as created_by_name, a.full_name as assigned_to_name",
      )
    ) {
      return this.data.tickets.map((ticket) => ({
        ...ticket,
        category_name: this.data.categories.find((c) => c.id === ticket.category_id)?.name || "Unknown",
        created_by_name: this.data.users.find((u) => u.id === ticket.created_by)?.full_name || "Unknown",
        assigned_to_name: ticket.assigned_to
          ? this.data.users.find((u) => u.id === ticket.assigned_to)?.full_name || "Unassigned"
          : "Unassigned",
      }))
    }

    if (sql.includes("SELECT t.*, c.name as category_name, u.full_name as created_by_name")) {
      let filteredTickets = this.data.tickets

      // Apply user filter if present
      if (sql.includes("WHERE t.created_by = $1")) {
        filteredTickets = this.data.tickets.filter((t) => t.created_by === params[0])
      }

      return filteredTickets.map((ticket) => ({
        ...ticket,
        category_name: this.data.categories.find((c) => c.id === ticket.category_id)?.name || "Unknown",
        created_by_name: this.data.users.find((u) => u.id === ticket.created_by)?.full_name || "Unknown",
      }))
    }

    if (sql.includes("SELECT tc.*, u.full_name as user_name")) {
      const ticketId = params[0]
      return this.data.comments
        .filter((c) => c.ticket_id === ticketId)
        .map((comment) => ({
          ...comment,
          user_name: this.data.users.find((u) => u.id === comment.user_id)?.full_name || "Unknown",
          user_role: this.data.users.find((u) => u.id === comment.user_id)?.role || "user",
        }))
    }

    // Analytics queries
    if (sql.includes("COUNT(*) as total_tickets")) {
      return [{ total_tickets: this.data.tickets.length }]
    }

    if (sql.includes("GROUP BY status")) {
      const statusCounts = this.data.tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1
        return acc
      }, {} as any)

      return Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
    }

    if (sql.includes("GROUP BY priority")) {
      const priorityCounts = this.data.tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
        return acc
      }, {} as any)

      return Object.entries(priorityCounts).map(([priority, count]) => ({ priority, count }))
    }

    return []
  }

  async insert(table: string, data: any): Promise<any> {
    const id = Date.now()
    const newItem = { id, ...data, created_at: new Date().toISOString() }
    this.data[table].push(newItem)

    // Update category ticket count
    if (table === "tickets") {
      const category = this.data.categories.find((c) => c.id === data.category_id)
      if (category) {
        category.ticket_count++
      }
    }

    return newItem
  }

  async update(table: string, id: number, data: any): Promise<any> {
    const items = this.data[table]
    const index = items.findIndex((item: any) => item.id === id)

    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() }
      return items[index]
    }

    return { id, ...data, updated_at: new Date().toISOString() }
  }

  async delete(table: string, id: number): Promise<boolean> {
    const items = this.data[table]
    const index = items.findIndex((item: any) => item.id === id)

    if (index !== -1) {
      items.splice(index, 1)
      return true
    }

    return false
  }
}

export const db = new MockDatabase()
