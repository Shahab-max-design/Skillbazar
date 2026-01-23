"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { technicianBookingRequests, dashboardStats, subscriptionPlans } from "@/lib/data"
import { getSubscriptionFromStorage, isOnsiteTechnician } from "@/lib/subscription"
import { Wallet, TrendingUp, Briefcase, Clock, Star, Check, X, Coins, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"

// Role guard
function useRoleGuard(router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const role = localStorage.getItem("userRole")
    console.log("Technician Dashboard - USER ROLE:", role)
    console.log("Technician Dashboard - CURRENT PATH:", window.location.pathname)
    if (role !== "technician") {
      console.log("❌ Access denied: Not a technician")
      router.push("/unauthorized")
    }
  }, [router])
}

export default function TechnicianDashboardPage() {
  const router = useRouter()
  useRoleGuard(router)
  const [requests, setRequests] = useState(technicianBookingRequests)
  const [creditMessage, setCreditMessage] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const stats = dashboardStats.technician
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  // Check subscription on mount
  useEffect(() => {
    const isOnsite = isOnsiteTechnician()
    if (isOnsite) {
      const subscription = getSubscriptionFromStorage()
      if (!subscription) {
        // Redirect to subscription selection if no plan exists
        router.push("/dashboard/technician/subscription")
      } else {
        // Get the plan details
        const plan = subscriptionPlans.find(p => p.id === subscription.plan)
        setCurrentPlan({ ...subscription, planDetails: plan })
      }
    }
  }, [router])

  // Use user data if logged in, otherwise use defaults
  const displayName = user?.name || "Technician"
  const displaySkill = user?.onsiteServices?.[0] || (user?.digitalSkills?.[0] || "Service Provider")

  const handleAccept = (id: string) => {
    if (!user) return
    
    // Get current subscription
    const subscription = getSubscriptionFromStorage()
    
    // Only deduct credits for onsite technicians with active subscription
    if (isOnsiteTechnician() && subscription) {
      const credits = subscription.credits as number | "unlimited"
      
      // Check if technician has credits
      if (credits === "unlimited") {
        // Unlimited credits - allow acceptance
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "confirmed" as const } : req)))
        setCreditMessage("Job accepted! ✓")
      } else if (typeof credits === "number" && credits > 0) {
        // Deduct 1 credit
        const newCredits = credits - 1
        subscription.credits = newCredits
        
        // Save updated subscription to localStorage
        localStorage.setItem("technicianSubscription", JSON.stringify(subscription))
        
        // Also update user object for consistency
        updateUser({ credits: newCredits })
        
        // Update current plan state for real-time dashboard update
        const plan = subscriptionPlans.find(p => p.id === subscription.plan)
        setCurrentPlan({ ...subscription, planDetails: plan })
        
        // Show message
        setCreditMessage(`1 credit deducted. ${newCredits} remaining`)
        
        // Update requests
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "confirmed" as const } : req)))
      } else {
        // No credits remaining
        setCreditMessage("No credits available. Upgrade your plan to accept more jobs.")
        return
      }
    } else if (!isOnsiteTechnician()) {
      // Digital provider - no credit deduction
      updateUser({ credits: (user.credits || 0) })
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "confirmed" as const } : req)))
      setCreditMessage("Job accepted! ✓")
    }
    
    // Auto-dismiss message after 2.5 seconds
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

          {/* Subscription Card */}
          {currentPlan && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {currentPlan.planDetails?.name || currentPlan.plan} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan.planDetails?.priceLabel || "Your current subscription"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/dashboard/technician/subscription")}
                  variant="outline"
                  className="gap-2"
                >
                  Change Plan
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Service Credits</p>
                  <p className="text-2xl font-bold text-foreground">
                    {currentPlan.credits === "unlimited" ? "∞" : currentPlan.credits}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentPlan.credits === "unlimited" 
                      ? "Unlimited" 
                      : "Monthly credits"
                    }
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Plan Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Since {new Date(currentPlan.activationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 col-span-2 md:col-span-1">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Plan Features</p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentPlan.planDetails?.features?.length || 0} features
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">+ Premium support</p>
                </div>
              </div>
            </div>
          )}

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
                          disabled={currentPlan && currentPlan.credits === 0}
                          className={`${
                            currentPlan && currentPlan.credits === 0
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                          title={currentPlan && currentPlan.credits === 0 ? "No credits available. Upgrade your plan." : "Accept job request"}
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
