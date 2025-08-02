"use client"

import { LogOut } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useRealtimeStore } from "@/lib/enhanced-realtime-store"
import { clearAuthUser } from "@/lib/auth"

export function LogoutButton() {
  const router = useRouter()
  const { setCurrentUser, currentUser } = useRealtimeStore()

  const handleLogout = () => {
    if (currentUser) {
      // Add logout activity
      const { addActivity } = useRealtimeStore.getState()
      addActivity({
        id: Date.now(),
        type: "user_logout",
        description: "logged out of the system",
        userId: currentUser.id,
        userName: currentUser.name,
        createdAt: new Date().toISOString(),
      })
    }

    clearAuthUser()
    setCurrentUser(null)
    router.push("/login")
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
