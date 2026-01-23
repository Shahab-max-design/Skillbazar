"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BookingsPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="My Bookings" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
              <p className="text-muted-foreground">Manage and track your service bookings</p>
            </div>

            {/* Empty State */}
            <Card className="p-12 text-center border-dashed">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-xl font-bold text-foreground mb-2">No Active Bookings</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any active bookings yet. Start by discovering professionals on the dashboard.
              </p>
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Find Professionals
              </Button>
            </Card>

            {/* Upcoming placeholder */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">Upcoming Bookings</h3>
              <p className="text-sm text-muted-foreground">No upcoming bookings scheduled</p>
            </div>

            {/* Past placeholder */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">Past Bookings</h3>
              <p className="text-sm text-muted-foreground">No past bookings yet</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
