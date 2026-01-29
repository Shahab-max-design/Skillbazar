"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { QuickCategories } from "@/components/quick-categories"
import { RecentProfessionalsSection } from "@/components/recent-professionals-section"
import { SupportSection } from "@/components/support-section"
import { useUser } from "@/hooks/use-user"

// Role guard
function useRoleGuard(router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const role = localStorage.getItem("userRole")
    console.log("Customer Dashboard - USER ROLE:", role)
    console.log("Customer Dashboard - CURRENT PATH:", window.location.pathname)
    if (role !== "customer") {
      console.log("❌ Access denied: Not a customer")
      router.push("/unauthorized")
    }
  }, [router])
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  useRoleGuard(router)
  const { user } = useUser()
  const displayName = user?.name || "Customer"

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader
          title="Dashboard"
          userName={displayName}
          userRole="Customer"
          profilePicture={user?.profilePicture}
        />

        <main className="p-4 lg:p-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {displayName}!</h1>
            <p className="text-lg text-muted-foreground">
              Discover and hire professionals for digital and onsite services
            </p>
          </div>

          {/* Main Content - Vertical Sections */}
          <div className="space-y-16">
            {/* Quick Categories Section */}
            <section>
              <QuickCategories />
            </section>

            {/* Recent Professionals Section */}
            <section>
              <RecentProfessionalsSection />
            </section>

            {/* Support Section */}
            <section>
              <SupportSection />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
