"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { redirectByRole } from "@/utils/roleRedirect"

export default function DashboardIndex() {
  const router = useRouter()

  useEffect(() => {
    console.log("DashboardIndex - Redirecting based on role")
    redirectByRole(router)
  }, [router])

  return null
}
