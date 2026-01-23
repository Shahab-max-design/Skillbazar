"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function TechnicianEarningsPage() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Earnings" 
          userName={user?.name || "Technician"} 
          userRole="Onsite Technician" 
        />

        <main className="p-4 lg:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Earnings</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pending */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Pending</h3>
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">PKR 8,500</p>
              <p className="text-sm text-muted-foreground mt-2">From completed jobs</p>
            </div>

            {/* Available */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Available</h3>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">PKR 15,200</p>
              <p className="text-sm text-muted-foreground mt-2">Ready to withdraw</p>
            </div>

            {/* Total */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Total Earnings</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">PKR 45,300</p>
              <p className="text-sm text-muted-foreground mt-2">All time</p>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Jobs</h2>
            <div className="space-y-4">
              {[
                { id: "1", service: "Electrical Repair - Ahmed Hassan", amount: "PKR 2,500", date: "2024-01-20" },
                { id: "2", service: "Plumbing - Fatima Khan", amount: "PKR 3,500", date: "2024-01-19" },
                { id: "3", service: "AC Repair - Hassan Ali", amount: "PKR 2,800", date: "2024-01-18" },
              ].map(job => (
                <div key={job.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{job.service}</p>
                    <p className="text-sm text-muted-foreground">{job.date}</p>
                  </div>
                  <p className="font-semibold text-green-600">+{job.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
