"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { getAuthUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return <LoginForm />
}
