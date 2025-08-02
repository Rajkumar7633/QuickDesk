"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdvancedReports } from "@/components/reports/advanced-reports"
import { useRealtimeStore } from "@/lib/realtime-store"

// Mock saved reports
const mockReports = [
  {
    id: 1,
    name: "Monthly Performance Report",
    type: "performance" as const,
    description: "Comprehensive performance analysis for the last 30 days",
    filters: {
      dateRange: "last_30_days",
      category: "all",
      priority: "all",
      status: "all",
    },
    data: [
      { date: "2024-01-01", resolved: 45, created: 52 },
      { date: "2024-01-02", resolved: 38, created: 41 },
      { date: "2024-01-03", resolved: 55, created: 48 },
      { date: "2024-01-04", resolved: 42, created: 39 },
      { date: "2024-01-05", resolved: 48, created: 44 },
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_by: "Admin User",
  },
  {
    id: 2,
    name: "Category Analysis Q1",
    type: "category_analysis" as const,
    description: "Ticket distribution and resolution times by category",
    filters: {
      dateRange: "last_90_days",
      category: "all",
      priority: "all",
      status: "all",
    },
    data: [
      { category: "Technical", count: 125, avgResolutionTime: 24 },
      { category: "Billing", count: 89, avgResolutionTime: 12 },
      { category: "Account", count: 67, avgResolutionTime: 8 },
      { category: "Feature Request", count: 45, avgResolutionTime: 72 },
    ],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    created_by: "Support Manager",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports)
  const { currentUser, setCurrentUser, users } = useRealtimeStore()
  const router = useRouter()

  useEffect(() => {
    // Set a default agent user if no user is logged in (for demo purposes)
    if (!currentUser) {
      const defaultAgent = users.find(user => user.role === "agent")
      if (defaultAgent) {
        setCurrentUser(defaultAgent)
      }
    }
  }, [currentUser, setCurrentUser, users])

  useEffect(() => {
    // Only agents and admins can access reports
    if (currentUser && !["agent", "admin"].includes(currentUser.role)) {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your session</p>
        </div>
      </div>
    )
  }

  if (!["agent", "admin"].includes(currentUser.role)) {
    return null
  }

  const handleCreateReport = (reportData: any) => {
    const newReport = {
      id: Math.max(...reports.map((r) => r.id)) + 1,
      ...reportData,
      data: [], // Would be populated by backend
      created_at: new Date().toISOString(),
      created_by: currentUser.full_name,
    }
    setReports([...reports, newReport])
  }

  const handleExportReport = (reportId: number, format: string) => {
    // Mock export functionality
    console.log(`Exporting report ${reportId} as ${format}`)

    // In a real app, this would trigger a download
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      const filename = `${report.name.replace(/\s+/g, "_")}.${format}`
      console.log(`Would download: ${filename}`)

      // Simulate file download
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return <AdvancedReports reports={reports} onCreateReport={handleCreateReport} onExportReport={handleExportReport} />
}
