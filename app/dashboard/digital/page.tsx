"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { useUser } from "@/hooks/use-user"
import { BarChart3, Users, TrendingUp, Clock, Star, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

// Role guard
function useRoleGuard(router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const role = localStorage.getItem("userRole")
    console.log("Digital Dashboard - USER ROLE:", role)
    console.log("Digital Dashboard - CURRENT PATH:", window.location.pathname)
    if (role !== "digital_provider") {
      console.log("❌ Access denied: Not a digital provider")
      router.push("/unauthorized")
    }
  }, [router])
}

interface DigitalServiceRequest {
  id: string
  clientName: string
  serviceType: string
  budget: number
  status: "pending" | "accepted" | "completed"
  createdAt: string
}

export default function DigitalDashboardPage() {
  const router = useRouter()
  useRoleGuard(router)
  const { user } = useUser()
  const [requests, setRequests] = useState<DigitalServiceRequest[]>([
    {
      id: "1",
      clientName: "Tech Startup Inc",
      serviceType: "Web Development",
      budget: 5000,
      status: "pending",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      clientName: "Design Agency",
      serviceType: "UI/UX Design",
      budget: 3000,
      status: "accepted",
      createdAt: "2024-01-19",
    },
    {
      id: "3",
      clientName: "E-commerce Store",
      serviceType: "SEO Optimization",
      budget: 2000,
      status: "completed",
      createdAt: "2024-01-18",
    },
  ])

  const displayName = user?.name || "Digital Provider"
  const primarySkill = user?.digitalSkills?.[0] || "Service Provider"

  const stats = {
    totalRequests: requests.length,
    activeProjects: requests.filter(r => r.status === "accepted").length,
    completedProjects: requests.filter(r => r.status === "completed").length,
    totalEarnings: requests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.budget, 0),
  }

  const handleAcceptRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "accepted" as const } : req
      )
    )
  }

  const handleCompleteRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "completed" as const } : req
      )
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Digital Services Dashboard" 
          userName={displayName} 
          userRole="Digital Provider" 
        />

        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your digital services and connect with clients
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Requests"
              value={stats.totalRequests}
              icon={<BarChart3 className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects}
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
            <StatCard
              title="Completed"
              value={stats.completedProjects}
              icon={<TrendingUp className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Total Earnings"
              value={`PKR ${stats.totalEarnings.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              color="emerald"
            />
          </div>

          {/* Requests Section */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Service Requests</h2>
              <span className="text-sm text-muted-foreground">
                {requests.length} total
              </span>
            </div>

            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {request.clientName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {request.serviceType} • PKR {request.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {request.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>

                      {request.status === "pending" && (
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Accept
                        </Button>
                      )}

                      {request.status === "accepted" && (
                        <Button
                          onClick={() => handleCompleteRequest(request.id)}
                          size="sm"
                          variant="outline"
                        >
                          Complete
                        </Button>
                      )}

                      {request.status === "completed" && (
                        <span className="text-green-600">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No service requests yet. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Import Check icon
import { Check } from "lucide-react"
