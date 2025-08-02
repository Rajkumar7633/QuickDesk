"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"

export function RealtimeIndicator() {
  const { isConnected } = useRealtimeStore()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1 px-3 py-1">
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </Badge>
    </div>
  )
}
