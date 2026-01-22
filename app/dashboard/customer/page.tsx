"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { customerBookings, dashboardStats } from "@/lib/data"
import { Calendar, CheckCircle, Clock, Wallet, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"

export default function CustomerDashboardPage() {
  const { user, updateUser } = useUser()
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const stats = dashboardStats.customer
  const { toast } = useToast()

  // Use user data if logged in, otherwise use defaults
  const displayName = user?.name || "Customer"
  const displayEmail = user?.email || "customer@example.com"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
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
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Overview" userName={displayName} userRole="Customer" />

        <main className="p-4 lg:p-8">
          {/* Edit Profile Button */}
          {user && (
            <div className="mb-6 flex justify-end">
              <EditProfileDialog user={user} onSave={handleProfileSave} />
            </div>
          )}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<Calendar className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Active Bookings"
              value={stats.activeBookings}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="Completed"
              value={stats.completedBookings}
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Total Spent"
              value={`Rs. ${stats.totalSpent.toLocaleString()}`}
              icon={<Wallet className="w-6 h-6" />}
              color="primary"
            />
          </div>

          {/* Recent Bookings */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customerBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.technicianImage || "/placeholder.svg"}
                            alt={booking.technicianName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-foreground">{booking.technicianName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{booking.service}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {booking.date} at {booking.time}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">Rs. {booking.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking.id)}
                            className="text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === "pending" && (
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Chart Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Booking History</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Service Distribution</h3>
              <div className="space-y-4">
                {[
                  { name: "Electrical", percentage: 40, color: "bg-yellow-500" },
                  { name: "Plumbing", percentage: 30, color: "bg-blue-500" },
                  { name: "AC Repair", percentage: 20, color: "bg-cyan-500" },
                  { name: "Other", percentage: 10, color: "bg-gray-400" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
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
