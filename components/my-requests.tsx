"use client"

import { ServiceRequest } from "@/hooks/use-user"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

interface MyRequestsProps {
  requests: ServiceRequest[]
}

export function MyRequests({ requests }: MyRequestsProps) {
  const getServiceTypeColor = (type: "digital" | "onsite") => {
    return type === "digital"
      ? "bg-blue-100 text-blue-700"
      : "bg-orange-100 text-orange-700"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "accepted":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (requests.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Requests Yet</h3>
        <p className="text-muted-foreground">
          Start by posting your first service request. Browse professionals and get work done.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left: Main Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-foreground">{request.serviceCategory}</h3>
                <Badge className={getServiceTypeColor(request.serviceType)}>
                  {request.serviceType === "digital" ? "📱 Digital" : "📍 Onsite"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2">{request.description}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {request.area && (
                  <span className="text-muted-foreground">📍 {request.area}</span>
                )}
                {request.providerName && (
                  <span className="text-muted-foreground">👤 {request.providerName}</span>
                )}
                <span className="text-muted-foreground">
                  📅 {format(new Date(request.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            {/* Right: Status */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <Badge className={getStatusColor(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
              <div className="text-xs text-muted-foreground">
                ID: {request.id.slice(-8)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
