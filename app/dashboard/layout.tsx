"use client"

import { useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    const role = localStorage.getItem("userRole")
    console.log("DashboardLayout - Current pathname:", pathname, "Role:", role);

    // Verify access based on role
    if (pathname.startsWith("/dashboard/technician") && role !== "technician") {
      console.log("❌ Access denied: Trying to access technician dashboard with role:", role);
      router.replace("/unauthorized")
      return
    }

    if (pathname.startsWith("/dashboard/digital") && role !== "digital_provider") {
      console.log("❌ Access denied: Trying to access digital dashboard with role:", role);
      router.replace("/unauthorized")
      return
    }

    if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
      console.log("❌ Access denied: Trying to access customer dashboard with role:", role);
      router.replace("/unauthorized")
      return
    }

    // Redirect to login if no role and accessing protected routes
    if (!role) {
      console.log("⚠️ No role found - redirecting to signin");
      router.replace("/auth/signin")
    } else {
      console.log("✅ Access granted for role:", role);
    }
  }, [pathname, router])

  return <>{children}</>
}
