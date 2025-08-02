"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Palette, Database, Globe, Clock, Save, RefreshCw } from "lucide-react"
import { useRealtimeStore } from "@/lib/realtime-store"

export default function SettingsPage() {
  const { currentUser, setCurrentUser, users } = useRealtimeStore()
  const router = useRouter()
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "QuickDesk",
    companyLogo: "",
    supportEmail: "support@quickdesk.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en",

    // Notification Settings
    emailNotifications: true,
    browserNotifications: true,
    smsNotifications: false,
    slackIntegration: false,
    teamsIntegration: false,
    notificationFrequency: "immediate",

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordComplexity: "medium",
    ipWhitelist: "",
    loginAttempts: 5,

    // SLA Settings
    slaLow: 72,
    slaMedium: 48,
    slaHigh: 24,
    slaUrgent: 4,

    // Appearance
    theme: "light",
    primaryColor: "#3B82F6",
    accentColor: "#10B981",

    // System Settings
    autoAssignment: true,
    autoEscalation: true,
    maintenanceMode: false,
    debugMode: false,
  })

  useEffect(() => {
    // Set a default admin user if no user is logged in (for demo purposes)
    if (!currentUser) {
      const defaultAdmin = users.find(user => user.role === "admin")
      if (defaultAdmin) {
        setCurrentUser(defaultAdmin)
      }
    }
  }, [currentUser, setCurrentUser, users])

  useEffect(() => {
    // Only admins can access system settings
    if (currentUser && currentUser.role !== "admin") {
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

  if (currentUser.role !== "admin") {
    return null
  }

  const handleSave = (category: string) => {
    console.log(`Saving ${category} settings:`, settings)
    // In real app, this would save to backend
  }

  const handleReset = (category: string) => {
    console.log(`Resetting ${category} settings`)
    // In real app, this would reset to defaults
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
          <Settings className="h-8 w-8 text-gray-600" />
          <span>System Settings</span>
        </h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>Basic system configuration and company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("general")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("general")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browserNotifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show browser push notifications</p>
                  </div>
                  <Switch
                    id="browserNotifications"
                    checked={settings.browserNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, browserNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                <Select
                  value={settings.notificationFrequency}
                  onValueChange={(value) => setSettings({ ...settings, notificationFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("notifications")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => setSettings({ ...settings, loginAttempts: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordComplexity">Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">Set password strength requirements</p>
                  </div>
                  <Select
                    value={settings.passwordComplexity}
                    onValueChange={(value) => setSettings({ ...settings, passwordComplexity: value })}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("security")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("security")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Settings */}
        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>SLA Settings</span>
              </CardTitle>
              <CardDescription>Configure Service Level Agreement response times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="slaLow">Low Priority (hours)</Label>
                  <Input
                    id="slaLow"
                    type="number"
                    value={settings.slaLow}
                    onChange={(e) => setSettings({ ...settings, slaLow: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="slaMedium">Medium Priority (hours)</Label>
                  <Input
                    id="slaMedium"
                    type="number"
                    value={settings.slaMedium}
                    onChange={(e) => setSettings({ ...settings, slaMedium: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="slaHigh">High Priority (hours)</Label>
                  <Input
                    id="slaHigh"
                    type="number"
                    value={settings.slaHigh}
                    onChange={(e) => setSettings({ ...settings, slaHigh: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="slaUrgent">Urgent Priority (hours)</Label>
                  <Input
                    id="slaUrgent"
                    type="number"
                    value={settings.slaUrgent}
                    onChange={(e) => setSettings({ ...settings, slaUrgent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current SLA Configuration</h4>
                <div className="grid gap-2 md:grid-cols-4">
                  <div className="text-center">
                    <Badge variant="secondary">Low</Badge>
                    <p className="text-sm mt-1">{settings.slaLow}h</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">Medium</Badge>
                    <p className="text-sm mt-1">{settings.slaMedium}h</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="default">High</Badge>
                    <p className="text-sm mt-1">{settings.slaHigh}h</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="destructive">Urgent</Badge>
                    <p className="text-sm mt-1">{settings.slaUrgent}h</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("sla")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("sla")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance Settings</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Color Preview</h4>
                <div className="flex items-center space-x-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      These colors will be applied throughout the application interface.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("appearance")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("appearance")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>Advanced system configuration and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAssignment">Auto Assignment</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign tickets to available agents</p>
                  </div>
                  <Switch
                    id="autoAssignment"
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoAssignment: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoEscalation">Auto Escalation</Label>
                    <p className="text-sm text-muted-foreground">Automatically escalate overdue tickets</p>
                  </div>
                  <Switch
                    id="autoEscalation"
                    checked={settings.autoEscalation}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoEscalation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable debug logging for troubleshooting</p>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
                  />
                </div>
              </div>

              {settings.maintenanceMode && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">Warning</Badge>
                    <span className="font-medium">Maintenance Mode Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    The system is currently in maintenance mode. Users will see a maintenance page.
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleReset("system")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => handleSave("system")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
