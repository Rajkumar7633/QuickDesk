"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Download, Bell, Camera, Mic, MapPin, Wifi, Battery, Share2, Star, QrCode } from "lucide-react"

interface MobileAppFeaturesProps {
  installPrompt?: any
  isInstalled: boolean
  onInstall: () => void
}

export function MobileAppFeatures({ installPrompt, isInstalled, onInstall }: MobileAppFeaturesProps) {
  const features = [
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get instant alerts for ticket updates, even when the app is closed",
      status: "available",
    },
    {
      icon: Camera,
      title: "Photo Attachments",
      description: "Take photos directly from your device and attach to tickets",
      status: "available",
    },
    {
      icon: Mic,
      title: "Voice Notes",
      description: "Record voice messages for detailed issue descriptions",
      status: "coming_soon",
    },
    {
      icon: MapPin,
      title: "Location Services",
      description: "Automatically include location data for on-site support requests",
      status: "coming_soon",
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "View tickets and draft responses even without internet connection",
      status: "available",
    },
    {
      icon: QrCode,
      title: "QR Code Scanner",
      description: "Scan QR codes to quickly create tickets for specific equipment",
      status: "coming_soon",
    },
  ]

  const appStats = {
    downloadSize: "2.1 MB",
    version: "1.0.0",
    rating: 4.8,
    reviews: 1247,
    lastUpdate: "2024-01-15",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Smartphone className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold">QuickDesk Mobile App</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take your help desk experience on the go with our Progressive Web App. Install QuickDesk on your mobile device
          for native app-like experience with offline capabilities.
        </p>
      </div>

      {/* Installation Section */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600" />
            <span>Install QuickDesk App</span>
            {isInstalled && <Badge variant="secondary">Installed</Badge>}
          </CardTitle>
          <CardDescription>
            {isInstalled
              ? "QuickDesk is installed on your device and ready to use!"
              : "Install QuickDesk as a Progressive Web App for the best mobile experience"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isInstalled && (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">QuickDesk PWA</h3>
                    <p className="text-sm text-muted-foreground">Size: {appStats.downloadSize}</p>
                  </div>
                </div>
                <Button onClick={onInstall} disabled={!installPrompt}>
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">App Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{appStats.rating}</span>
                    <span className="text-sm text-muted-foreground">({appStats.reviews})</span>
                  </div>
                </div>
                <Progress value={appStats.rating * 20} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Installation Progress</span>
                  <span className="text-sm text-muted-foreground">{isInstalled ? "100%" : "0%"}</span>
                </div>
                <Progress value={isInstalled ? 100 : 0} className="h-2" />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3 text-sm">
              <div>
                <span className="font-medium">Version:</span> {appStats.version}
              </div>
              <div>
                <span className="font-medium">Size:</span> {appStats.downloadSize}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {new Date(appStats.lastUpdate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span>{feature.title}</span>
                  <Badge variant={feature.status === "available" ? "default" : "secondary"} className="text-xs">
                    {feature.status === "available" ? "Available" : "Coming Soon"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
              {feature.status === "coming_soon" && (
                <div className="absolute inset-0 bg-gray-100/50 rounded-lg flex items-center justify-center">
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Installation Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Installation Instructions</CardTitle>
          <CardDescription>How to install QuickDesk on different devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>iOS (iPhone/iPad)</span>
              </h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Open QuickDesk in Safari browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Tap the Share button at the bottom</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Select "Add to Home Screen"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Tap "Add" to install the app</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Android</span>
              </h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Open QuickDesk in Chrome browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Look for the "Install" banner or use the menu</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Tap "Install" when prompted</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>The app will be added to your home screen</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use the Mobile App?</CardTitle>
          <CardDescription>Benefits of installing QuickDesk as a mobile app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Battery className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Better Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Faster loading times and smoother interactions with native app-like performance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive instant notifications for ticket updates even when the app is closed
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Wifi className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Offline Access</h4>
                  <p className="text-sm text-muted-foreground">
                    View tickets and draft responses even without an internet connection
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Share2 className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Easy Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Quickly share tickets and information using native device sharing capabilities
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Device Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Access camera, microphone, and other device features for richer ticket creation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Home Screen Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Quick access from your device's home screen without opening a browser
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
