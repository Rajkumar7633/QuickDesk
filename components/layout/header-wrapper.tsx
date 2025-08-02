"use client"

import { useRealtimeStore } from "@/lib/realtime-store"
import { Header } from "./header"

export function HeaderWrapper() {
  const { currentUser } = useRealtimeStore()

  if (!currentUser) return null

  return <Header />
}
