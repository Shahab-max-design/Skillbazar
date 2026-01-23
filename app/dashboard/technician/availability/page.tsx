"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  status: "available" | "unavailable"
}

export default function TechnicianAvailabilityPage() {
  const router = useRouter()
  const { user } = useUser()

  const weekSchedule: TimeSlot[] = [
    { id: "1", day: "Monday", startTime: "09:00", endTime: "17:00", status: "available" },
    { id: "2", day: "Tuesday", startTime: "09:00", endTime: "17:00", status: "available" },
    { id: "3", day: "Wednesday", startTime: "10:00", endTime: "16:00", status: "available" },
    { id: "4", day: "Thursday", startTime: "Off", endTime: "", status: "unavailable" },
    { id: "5", day: "Friday", startTime: "09:00", endTime: "17:00", status: "available" },
    { id: "6", day: "Saturday", startTime: "10:00", endTime: "18:00", status: "available" },
    { id: "7", day: "Sunday", startTime: "Off", endTime: "", status: "unavailable" },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Availability" 
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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Availability & Schedule</h1>
              <p className="text-muted-foreground">Set your working hours and availability</p>
            </div>
            <Button>Update Schedule</Button>
          </div>

          <div className="space-y-3">
            {weekSchedule.map(slot => (
              <div key={slot.id} className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{slot.day}</h3>
                      {slot.status === "available" ? (
                        <p className="text-sm text-green-600">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Not Available</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      slot.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {slot.status}
                    </span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-12">
              Mark All Days Available
            </Button>
            <Button variant="outline" className="h-12">
              Mark All Days Unavailable
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
