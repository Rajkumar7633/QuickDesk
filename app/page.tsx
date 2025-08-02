"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Clock, Users, Zap } from "lucide-react"
import { getAuthUser } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Real-time Updates",
      description: "Get instant notifications and live updates on all ticket activities",
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with role-based access and team features",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "SLA Management",
      description: "Track and manage service level agreements with automated alerts",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
      title: "Smart Analytics",
      description: "Gain insights with comprehensive reporting and analytics dashboard",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Welcome to QuickDesk
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Modern Help Desk
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your customer support with our powerful, intuitive help desk solution. Manage tickets, track
            performance, and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")} className="text-lg px-8">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Demo Accounts</CardTitle>
            <CardDescription>Try QuickDesk with these pre-configured demo accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="destructive" className="mb-2">
                  Admin
                </Badge>
                <p className="text-sm font-mono">admin@quickdesk.com</p>
                <p className="text-sm font-mono text-gray-500">admin123</p>
                <p className="text-xs text-gray-600 mt-2">Full system access</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="default" className="mb-2">
                  Agent
                </Badge>
                <p className="text-sm font-mono">agent@quickdesk.com</p>
                <p className="text-sm font-mono text-gray-500">agent123</p>
                <p className="text-xs text-gray-600 mt-2">Ticket management</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  User
                </Badge>
                <p className="text-sm font-mono">user@quickdesk.com</p>
                <p className="text-sm font-mono text-gray-500">user123</p>
                <p className="text-xs text-gray-600 mt-2">Create tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
