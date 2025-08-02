"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users, Ticket, Plus, ArrowUpRight } from "lucide-react"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"
import Link from "next/link"

export function RealtimeDashboard() {
  const { tickets, users, currentUser, getAnalytics } = useRealtimeStore()
  const [analytics, setAnalytics] = useState(getAnalytics())

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalytics())
    }, 5000)

    return () => clearInterval(interval)
  }, [getAnalytics])

  const recentTickets = tickets.slice(0, 5)
  const onlineUsers = users.filter((u) => u.status === "online")

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const statusColors = {
    open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {currentUser?.name || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your help desk today.</p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTickets}</div>
            <p className="text-xs text-muted-foreground">+{analytics.ticketsLast24h} from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((analytics.openTickets / analytics.totalTickets) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">{onlineUsers.length} online now</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ticket.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {ticket.createdBy.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
                  </div>
                </div>
              ))}
              {recentTickets.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tickets yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SLA Compliance</span>
                <span className="text-sm text-gray-500">{analytics.slaCompliance}%</span>
              </div>
              <Progress value={analytics.slaCompliance} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm text-gray-500">{analytics.customerSatisfaction}%</span>
              </div>
              <Progress value={analytics.customerSatisfaction} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avg Resolution Time</span>
                <span className="text-sm text-gray-500">{analytics.avgResolutionTime}h</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="mr-1 h-3 w-3" />
                Target: 24h
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/tickets/new">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Plus className="h-6 w-6 mb-2" />
                New Ticket
              </Button>
            </Link>
            <Link href="/tickets">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Ticket className="h-6 w-6 mb-2" />
                View All Tickets
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <TrendingUp className="h-6 w-6 mb-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/knowledge-base">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <ArrowUpRight className="h-6 w-6 mb-2" />
                Knowledge Base
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
