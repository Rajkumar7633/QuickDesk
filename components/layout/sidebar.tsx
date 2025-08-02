"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Mail,
  Settings,
  Ticket,
  Users,
  FileText,
  Smartphone,
} from "lucide-react"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "My Tickets", href: "/tickets/my", icon: FileText },
  { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin", "agent"] },
  { name: "Users", href: "/users", icon: Users, roles: ["admin"] },
  { name: "Categories", href: "/categories", icon: Settings, roles: ["admin"] },
  { name: "Ticket Templates", href: "/ticket-templates", icon: FileText, roles: ["admin", "agent"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "agent"] },
  { name: "Mobile App", href: "/mobile", icon: Smartphone },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { currentUser, tickets, notifications } = useRealtimeStore()

  if (!currentUser) return null

  const filteredNavigation = navigation.filter((item) => !item.roles || item.roles.includes(currentUser.role))

  const getItemBadge = (item: any) => {
    switch (item.href) {
      case "/tickets":
        const openTickets = tickets.filter((t) => t.status === "open").length
        return openTickets > 0 ? openTickets : null
      case "/tickets/my":
        const myTickets = tickets.filter((t) => t.createdBy.id === currentUser.id && t.status !== "closed").length
        return myTickets > 0 ? myTickets : null
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-2">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            const badge = getItemBadge(item)

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-primary text-primary-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={cn("flex items-center space-x-3", collapsed && "justify-center")}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
