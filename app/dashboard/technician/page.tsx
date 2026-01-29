"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { technicianBookingRequests, dashboardStats, subscriptionPlans } from "@/lib/data"
import { getSubscriptionFromStorage, isOnsiteTechnician } from "@/lib/subscription"
import { deductCreditsForJob, canAcceptJob, refundCreditsForJob, getJobCost } from "@/lib/credits"
import { CreditHistory } from "@/components/credit-history"
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
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  // Safe variables for Header
  const displayName = user?.name || "Technician"
  const displaySkill = user?.role === "technician" && user?.serviceType === "onsite"
    ? "Onsite Technician"
    : (user?.role || "Skill not defined")
  // Merge mock data with local storage data for demo purposes
  const [requests, setRequests] = useState<any[]>([])
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [creditMessage, setCreditMessage] = useState<string | null>(null)
  const stats = dashboardStats.technician

  // Load requests and subscription
  useEffect(() => {
    const loadData = () => {
      // Load requests
      const stored = localStorage.getItem("technicianRequests")
      const localRequests = stored ? JSON.parse(stored) : []
      setRequests([...technicianBookingRequests, ...localRequests])

      // Load subscription
      const sub = getSubscriptionFromStorage()
      setCurrentPlan(sub)
    }

    loadData()

    // Listen for events
    window.addEventListener("new-job-request", loadData)
    window.addEventListener("credits-updated", loadData)

    return () => {
      window.removeEventListener("new-job-request", loadData)
      window.removeEventListener("credits-updated", loadData)
    }
  }, [])

  const handleAccept = (id: string, serviceType: string = "digital") => {
    if (!user) return

    // ONSITE LOGIC
    if (isOnsiteTechnician() || serviceType === "onsite") {
      // 1. Check Subscription & Credits
      const sub = getSubscriptionFromStorage()
      if (!sub) {
        toast({ title: "Error", description: "No active subscription found.", variant: "destructive" })
        return
      }

      // 2. Validate Credits
      if (!canAcceptJob(sub.credits)) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${getJobCost()} credits to accept this job. Please upgrade your plan.`,
          variant: "destructive"
        })
        return
      }

      // 3. Deduct Credits
      const currentCredits = sub.credits === "unlimited" ? 99999 : sub.credits
      const result = deductCreditsForJob(id, currentCredits)

      if (!result.success) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        return
      }

      // 4. Update Subscription Storage
      if (sub.credits !== "unlimited") {
        sub.credits = result.newBalance
        localStorage.setItem("technicianSubscription", JSON.stringify(sub))
        // Update local state
        setCurrentPlan({ ...sub })
        updateUser({ credits: sub.credits })
        window.dispatchEvent(new Event("credits-updated"))
      }

      // 5. Update Request Status
      const updatedRequests = requests.map(req =>
        req.id === id ? { ...req, status: "accepted" } : req
      )
      setRequests(updatedRequests)

      // Update localStorage if it's a local request
      const stored = localStorage.getItem("technicianRequests")
      if (stored) {
        const localReqs = JSON.parse(stored)
        const newLocalReqs = localReqs.map((r: any) => r.id === id ? { ...r, status: "accepted" } : r)
        localStorage.setItem("technicianRequests", JSON.stringify(newLocalReqs))
      }

      // 6. Show Success Message
      toast({
        title: "Job Accepted",
        description: "2 credits have been deducted from your plan for this job request.",
        className: "bg-green-50 border-green-200 text-green-800"
      })

    } else {
      // DIGITAL LOGIC (Keep existing or simple confirm)
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "confirmed" } : req)))
      setCreditMessage("Job accepted! ✓")
    }
  }

  const handleUnlockContact = (id: string) => {
    // Check credits
    const subscription = getSubscriptionFromStorage()
    const currentCredits = subscription?.credits || 0

    if (typeof currentCredits === "number" && currentCredits < 2) {
      setCreditMessage("Insufficient credits to unlock contact (Needs 2).")
      return
    }

    // Deduct credits
    if (subscription && typeof subscription.credits === "number") {
      subscription.credits -= 2
      localStorage.setItem("technicianSubscription", JSON.stringify(subscription))
      // Update local state immediately to reflect change
      setCurrentPlan({ ...subscription })
      updateUser({ credits: subscription.credits })
      window.dispatchEvent(new Event("credits-updated"))
    }

    // Update request state to 'contact_unlocked' (custom flag)
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, contactUnlocked: true } : req
    )
    setRequests(updatedRequests)

    // Update localStorage
    const stored = localStorage.getItem("technicianRequests")
    if (stored) {
      const localReqs = JSON.parse(stored)
      const newLocalReqs = localReqs.map((r: any) => r.id === id ? { ...r, contactUnlocked: true } : r)
      localStorage.setItem("technicianRequests", JSON.stringify(newLocalReqs))
    }

    setCreditMessage("Contact Unlocked! -2 Credits")
    setTimeout(() => setCreditMessage(null), 3000)
  }

  const handleReject = (id: string) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: "rejected" } : req
    )
    setRequests(updatedRequests)

    // Update localStorage
    const stored = localStorage.getItem("technicianRequests")
    if (stored) {
      const localReqs = JSON.parse(stored)
      const newLocalReqs = localReqs.map((r: any) => r.id === id ? { ...r, status: "rejected" } : r)
      localStorage.setItem("technicianRequests", JSON.stringify(newLocalReqs))
    }
  }

  // Temporary function to simulate cancellation/refund (Only valid if contact was unlocked? Simplified for now)
  const handleSimulateCancel = (id: string) => {
    // Simplified for demo
    handleReject(id)
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

  // Calculate job capacity
  const jobCapacity = currentPlan && typeof currentPlan.credits === "number"
    ? Math.floor(currentPlan.credits / 2)
    : (currentPlan?.credits === "unlimited" ? "Unlimited" : 0)

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader
          title="Overview"
          userName={displayName}
          userRole={displaySkill}
          profilePicture={user?.profilePicture}
        />

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
              value={currentPlan?.credits ?? 0}
              icon={<Coins className="w-6 h-6" />}
              subtitle={`${jobCapacity} Jobs Capacity`}
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
                  <p className="text-xs text-muted-foreground font-medium mb-1">Jobs Capacity</p>
                  <p className="text-sm font-semibold text-foreground">
                    Can accept ~{jobCapacity} more jobs
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 credits per job</p>
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
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={request.technicianImage || "/placeholder.svg"} // Actually customer image would be better here if available
                      alt={request.technicianName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{request.customerName || request.technicianName || "Guest User"}</h3>
                      <p className="text-primary font-medium text-sm">{request.service}</p>

                      {/* ONSITE Details */}
                      {request.serviceType === "onsite" && (
                        <div className="mt-1 space-y-1">
                          <p className="font-medium text-sm text-foreground">{request.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {request.date} {request.time}</span>
                            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> {request.location}</span>
                          </div>
                        </div>
                      )}

                      {/* DIGITAL Details */}
                      {request.serviceType !== "onsite" && (
                        <p className="text-muted-foreground text-sm">
                          {request.date} at {request.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:text-left">
                    <div className="text-lg font-bold text-foreground">
                      {request.amount ? `Rs. ${request.amount.toLocaleString()}` : "Pending Quote"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.serviceType === "onsite" ? "Budget" : "Service fee"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {request.status === "pending" ? (
                      <>
                        <Button
                          onClick={() => handleAccept(request.id, request.serviceType)}
                          className="bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent w-full"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    ) : request.status === "accepted" && request.serviceType === "onsite" ? (
                      <div className="space-y-2">
                        {request.contactUnlocked ? (
                          <div className="bg-green-50 p-2 rounded border border-green-200 text-center">
                            <p className="text-xs text-green-700 font-bold">Contact Revealed:</p>
                            <p className="text-sm font-mono text-green-800">0300-1234567</p>
                            <Button variant="outline" size="sm" className="w-full mt-1 h-7 text-xs">
                              Open Chat
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-amber-50 p-2 rounded border border-amber-200 text-center">
                            <p className="text-xs text-amber-700 font-bold mb-1">Contact Masked</p>
                            <p className="text-sm font-mono text-amber-800 mb-2">03XX-***-**12</p>
                            <Button
                              size="sm"
                              className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                              onClick={() => handleUnlockContact(request.id)}
                            >
                              Unlock (-2 Credits)
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-medium w-full text-center ${request.status === "confirmed" || request.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credit History */}
            <div>
              <CreditHistory />
            </div>

            {/* Job Types */}
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
