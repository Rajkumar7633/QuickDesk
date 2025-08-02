"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileBarChart, Download, TrendingUp, Users, Clock, Target, Plus, Eye } from "lucide-react"

interface ReportData {
  id: number
  name: string
  type: "performance" | "user_activity" | "category_analysis" | "sla_compliance" | "custom"
  description: string
  filters: any
  data: any[]
  created_at: string
  created_by: string
}

interface AdvancedReportsProps {
  reports: ReportData[]
  onCreateReport: (report: any) => void
  onExportReport: (reportId: number, format: string) => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const reportTypes = [
  { value: "performance", label: "Performance Analysis", icon: TrendingUp },
  { value: "user_activity", label: "User Activity", icon: Users },
  { value: "category_analysis", label: "Category Analysis", icon: BarChart },
  { value: "sla_compliance", label: "SLA Compliance", icon: Clock },
  { value: "custom", label: "Custom Report", icon: Target },
]

export function AdvancedReports({ reports, onCreateReport, onExportReport }: AdvancedReportsProps) {
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState("last_30_days")

  const handleCreateReport = (formData: FormData) => {
    const reportData = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      filters: {
        dateRange: formData.get("dateRange") as string,
        category: formData.get("category") as string,
        priority: formData.get("priority") as string,
        status: formData.get("status") as string,
      },
    }
    onCreateReport(reportData)
    setIsCreateDialogOpen(false)
  }

  const renderChart = (report: ReportData) => {
    switch (report.type) {
      case "performance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="resolved" stroke="#8884d8" name="Resolved Tickets" />
              <Line type="monotone" dataKey="created" stroke="#82ca9d" name="Created Tickets" />
            </LineChart>
          </ResponsiveContainer>
        )

      case "category_analysis":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Ticket Count" />
              <Bar dataKey="avgResolutionTime" fill="#82ca9d" name="Avg Resolution (hrs)" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "user_activity":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={report.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {report.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "sla_compliance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="compliance" fill="#00C49F" name="SLA Compliance %" />
              <Bar dataKey="breaches" fill="#FF8042" name="SLA Breaches" />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <FileBarChart className="mx-auto h-12 w-12 mb-2" />
              <p>Custom report visualization</p>
            </div>
          </div>
        )
    }
  }

  const mockReportData = {
    performance: [
      { date: "2024-01-01", resolved: 45, created: 52 },
      { date: "2024-01-02", resolved: 38, created: 41 },
      { date: "2024-01-03", resolved: 55, created: 48 },
      { date: "2024-01-04", resolved: 42, created: 39 },
      { date: "2024-01-05", resolved: 48, created: 44 },
    ],
    category_analysis: [
      { category: "Technical", count: 125, avgResolutionTime: 24 },
      { category: "Billing", count: 89, avgResolutionTime: 12 },
      { category: "Account", count: 67, avgResolutionTime: 8 },
      { category: "Feature Request", count: 45, avgResolutionTime: 72 },
    ],
    user_activity: [
      { name: "Active Users", value: 65 },
      { name: "Inactive Users", value: 25 },
      { name: "New Users", value: 10 },
    ],
    sla_compliance: [
      { priority: "Low", compliance: 95, breaches: 2 },
      { priority: "Medium", compliance: 88, breaches: 8 },
      { priority: "High", compliance: 82, breaches: 12 },
      { priority: "Urgent", compliance: 75, breaches: 18 },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
            <FileBarChart className="h-6 w-6 text-green-600" />
            <span>Advanced Reports</span>
          </h2>
          <p className="text-muted-foreground">Generate detailed analytics and custom reports</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Report</DialogTitle>
              <DialogDescription>Generate a new report with custom filters and parameters</DialogDescription>
            </DialogHeader>
            <form action={handleCreateReport}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Report Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Monthly Performance" required />
                  </div>
                  <div>
                    <Label htmlFor="type">Report Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Brief description of the report" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select name="dateRange" defaultValue="last_30_days">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                        <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                        <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                        <SelectItem value="last_year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category Filter</Label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority Filter</Label>
                    <Select name="priority">
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
                  </div>
                  <div>
                    <Label htmlFor="status">Status Filter</Label>
                    <Select name="status">
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Generate Report</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Reports */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card key={type.value} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span>{type.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => {
                    const mockReport: ReportData = {
                      id: Date.now(),
                      name: type.label,
                      type: type.value as any,
                      description: `Quick ${type.label.toLowerCase()} report`,
                      filters: { dateRange: "last_30_days" },
                      data: mockReportData[type.value as keyof typeof mockReportData] || [],
                      created_at: new Date().toISOString(),
                      created_by: "Current User",
                    }
                    setSelectedReport(mockReport)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Quick View
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Reports ({reports.length})</CardTitle>
          <CardDescription>Your custom and scheduled reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileBarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No saved reports</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first custom report to get started</p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <Badge variant="outline">{reportTypes.find((t) => t.value === report.type)?.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Created by {report.created_by} on {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Select onValueChange={(format) => onExportReport(report.id, format)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Export" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Viewer */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileBarChart className="h-5 w-5" />
              <span>{selectedReport?.name}</span>
            </DialogTitle>
            <DialogDescription>{selectedReport?.description}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{reportTypes.find((t) => t.value === selectedReport.type)?.label}</Badge>
                  <Badge variant="secondary">
                    {selectedReport.filters?.dateRange?.replace("_", " ") || "All Time"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onExportReport(selectedReport.id, "pdf")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onExportReport(selectedReport.id, "csv")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4">{renderChart(selectedReport)}</div>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedReport.data?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Date Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">{selectedReport.filters?.dateRange?.replace("_", " ") || "All Time"}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Generated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">{new Date(selectedReport.created_at).toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
