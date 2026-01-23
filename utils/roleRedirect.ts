/**
 * Centralized Role-Based Redirect Utility
 * Single source of truth for dashboard routing
 */

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const redirectByRole = (router: AppRouterInstance): void => {
  if (typeof window === "undefined") return

  const role = localStorage.getItem("userRole")
  console.log("redirectByRole - USER ROLE:", role)
  console.log("redirectByRole - CURRENT PATH:", window.location.pathname)

  if (!role) {
    console.log("redirectByRole - No role found, redirecting to login")
    router.push("/auth/signin")
    return
  }

  if (role === "customer") {
    console.log("redirectByRole - Redirecting to customer dashboard")
    router.push("/dashboard/customer")
    return
  }

  if (role === "technician") {
    console.log("redirectByRole - Redirecting to technician dashboard")
    router.push("/dashboard/technician")
    return
  }

  if (role === "digital_provider") {
    console.log("redirectByRole - Redirecting to digital dashboard")
    router.push("/dashboard/digital")
    return
  }

  console.log("redirectByRole - Invalid role, redirecting to login")
  router.push("/auth/signin")
}
