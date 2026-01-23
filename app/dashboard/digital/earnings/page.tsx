"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function DigitalEarningsPage() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Earnings" 
          userName={user?.name || "Digital Provider"} 
          userRole="Digital Provider" 
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
              <p className="text-3xl font-bold text-foreground">$2,450</p>
              <p className="text-sm text-muted-foreground mt-2">From completed orders</p>
            </div>

            {/* Available */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Available</h3>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">$5,200</p>
              <p className="text-sm text-muted-foreground mt-2">Ready to withdraw</p>
            </div>

            {/* Total */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Total Earnings</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">$7,650</p>
              <p className="text-sm text-muted-foreground mt-2">All time</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {[
                { id: "1", description: "Web Development Order - Tech Startup", amount: 1200, date: "2024-01-20" },
                { id: "2", description: "UI/UX Design - Design Agency", amount: 800, date: "2024-01-19" },
                { id: "3", description: "SEO Optimization - E-commerce", amount: 600, date: "2024-01-18" },
              ].map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                  <p className="font-semibold text-green-600">+${tx.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
