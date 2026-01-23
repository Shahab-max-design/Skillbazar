"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Order {
  id: string
  clientName: string
  gig: string
  amount: number
  status: "pending" | "in-progress" | "completed"
  dueDate: string
}

export default function DigitalOrdersPage() {
  const router = useRouter()
  const { user } = useUser()
  
  const orders: Order[] = [
    {
      id: "1",
      clientName: "Tech Startup Inc",
      gig: "Web Development",
      amount: 1200,
      status: "in-progress",
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      clientName: "Design Agency",
      gig: "UI/UX Design",
      amount: 800,
      status: "completed",
      dueDate: "2024-02-10",
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Orders" 
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

          <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your client orders</p>

          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{order.gig}</h3>
                      <p className="text-sm text-muted-foreground">from {order.clientName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "completed" 
                      ? "bg-green-100 text-green-700"
                      : order.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-foreground">${order.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-semibold text-foreground">{order.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
