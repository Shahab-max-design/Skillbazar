"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { technicianBookingRequests, dashboardStats } from "@/lib/data"
import { Wallet, TrendingUp, Briefcase, Clock, Star, Check, X, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"

export default function TechnicianDashboardPage() {
  const [requests, setRequests] = useState(technicianBookingRequests)
  const [creditMessage, setCreditMessage] = useState<string | null>(null)
  const stats = dashboardStats.technician
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  // Use user data if logged in, otherwise use defaults
  const displayName = user?.name || "Technician"
  const displaySkill = user?.onsiteServices?.[0] || (user?.digitalSkills?.[0] || "Service Provider")

  const handleAccept = (id: string) => {
    if (!user) return
    
    // Calculate new credits
    const newCredits = Math.max(0, user.credits - 1)
    
    // Update user credits in state and localStorage
    updateUser({ credits: newCredits })
    
    // Show non-intrusive credit message
    setCreditMessage(`1 credit deducted. ${newCredits} remaining`)
    
    // Auto-dismiss after 2.5 seconds
    const timeout = setTimeout(() => {
      setCreditMessage(null)
    }, 2500)

    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "confirmed" as const } : req)))
    
    return () => clearTimeout(timeout)
  }

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "cancelled" as const } : req)))
  }

  const handleProfileSave = (updatedUser: typeof user) => {
    if (updatedUser) {
      updateUser(updatedUser)
      // Show success toast
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader title="Overview" userName={displayName} userRole={displaySkill} />

        <main className="p-4 lg:p-8">
          {/* Edit Profile Button */}
          {user && (
            <div className="mb-6 flex justify-end">
              <EditProfileDialog user={user} onSave={handleProfileSave} />
            </div>
          )}
          {/* Credit Deduction Message - Small Toast */}
          {creditMessage && (
            <div className="fixed top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg animate-fade-in z-50">
              {creditMessage}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Earnings"
              value={`Rs. ${stats.totalEarnings.toLocaleString()}`}
              icon={<Wallet className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="This Month"
              value={`Rs. ${stats.thisMonthEarnings.toLocaleString()}`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: 12, isPositive: true }}
              color="primary"
            />
            <StatCard
              title="Completed Jobs"
              value={stats.completedJobs}
              icon={<Briefcase className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="Credits Available"
              value={user?.credits ?? 10}
              icon={<Coins className="w-6 h-6" />}
              subtitle="1 credit per job"
              color="primary"
            />
          </div>

          {/* Booking Requests */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Booking Requests</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {requests.filter((r) => r.status === "pending").length} Pending
              </span>
            </div>

            <div className="divide-y divide-border">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={request.technicianImage || "/placeholder.svg"}
                      alt={request.technicianName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{request.technicianName}</h3>
                      <p className="text-primary font-medium text-sm">{request.service}</p>
                      <p className="text-muted-foreground text-sm">
                        {request.date} at {request.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-left">
                    <div className="text-lg font-bold text-foreground">Rs. {request.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Service fee</div>
                  </div>

                  <div className="flex gap-2">
                    {request.status === "pending" ? (
                      <>
                        <Button
                          onClick={() => handleAccept(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          request.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {request.status === "confirmed" ? "Accepted" : "Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Earnings</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[15000, 22000, 18000, 28000, 24000, 30000].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-green-500/20 rounded-t-lg transition-all hover:bg-green-500/40"
                      style={{ height: `${(value / 30000) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Job Types</h3>
              <div className="space-y-4">
                {[
                  { name: "Wiring", count: 156, color: "bg-primary" },
                  { name: "Fan Installation", count: 98, color: "bg-green-500" },
                  { name: "Circuit Repair", count: 87, color: "bg-amber-500" },
                  { name: "LED Installation", count: 109, color: "bg-cyan-500" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
