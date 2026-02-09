"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useUser } from "@/hooks/use-user"
import { CustomerRequestList } from "@/components/customer-request-list"
import { CustomerDigitalOrdersList } from "@/components/customer-digital-orders-list"

export default function BookingsPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardSidebar type="customer" />
      <div className="lg:ml-64">
        <DashboardHeader
          title="My Requests"
          userName={user?.name || "Customer"}
          userRole="Customer"
        />
        <main className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Onsite Service Requests</h1>
            <p className="text-muted-foreground mt-2">
              Track the status of your onsite job requests and view technician responses.
            </p>
          </div>

          <CustomerRequestList />

          {/* My Digital Orders Section */}
          <div className="mt-12">
            <h1 className="text-2xl font-bold text-foreground">My Digital Orders</h1>
            <p className="text-muted-foreground mt-2">
              Track your digital service orders including logo design, video editing, and more.
            </p>
          </div>

          <CustomerDigitalOrdersList />
        </main>
      </div>
    </div>
  )
}
