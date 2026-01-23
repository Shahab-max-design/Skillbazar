"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, CheckCircle } from "lucide-react"

interface Booking {
  id: string
  professional: string
  service: string
  status: "completed" | "in-progress" | "upcoming"
  scheduledDate: string
  eta?: string
  location?: string
}

const activeBookings: Booking[] = [
  {
    id: "1",
    professional: "Ahmad Khan",
    service: "Electrical Repair",
    status: "in-progress",
    scheduledDate: "Today",
    eta: "Technician is 2km away, arriving in 15 mins",
    location: "Gulberg, Lahore",
  },
  {
    id: "2",
    professional: "Web Solutions Team",
    service: "Website Design",
    status: "in-progress",
    scheduledDate: "Today",
    eta: "Digital delivery in 2 hours",
  },
  {
    id: "3",
    professional: "Hassan Plumber",
    service: "Plumbing Services",
    status: "upcoming",
    scheduledDate: "Tomorrow, 10:00 AM",
    location: "Karachi",
  },
]

export function ActiveBookingTracker() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "upcoming":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "upcoming":
        return "Upcoming"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-foreground mb-4">Active Booking Tracker</h3>
      <div className="space-y-4">
        {activeBookings.map((booking, index) => (
          <div key={booking.id} className="pb-4 border-b border-border last:pb-0 last:border-0">
            {/* Timeline indicator */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>
                {index < activeBookings.length - 1 && (
                  <div className="w-1 h-12 bg-primary/20 my-2"></div>
                )}
              </div>

              {/* Booking details */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{booking.professional}</p>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                  </div>
                  <Badge className={`${getStatusColor(booking.status)} border`}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>

                {/* ETA or schedule */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{booking.scheduledDate}</span>
                  </div>

                  {booking.eta && (
                    <div className="flex items-start gap-2 text-primary font-medium bg-primary/5 p-2 rounded">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{booking.eta}</span>
                    </div>
                  )}

                  {booking.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
