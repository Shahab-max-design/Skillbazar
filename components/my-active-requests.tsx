"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ActiveRequest {
  id: string
  serviceCategory: string
  serviceType: "digital" | "onsite"
  description: string
  status: "pending" | "accepted" | "in_progress" | "completed"
  providerName?: string
  providerImage?: string
  createdAt: string
}

interface MyActiveRequestsProps {
  requests: ActiveRequest[]
}

export function MyActiveRequests({ requests }: MyActiveRequestsProps) {
  if (requests.length === 0) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <AlertCircle className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "accepted":
        return "bg-blue-100 text-blue-700"
      case "in_progress":
        return "bg-purple-100 text-purple-700"
      case "completed":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for response"
      case "accepted":
        return "Professional assigned"
      case "in_progress":
        return "Work in progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Active Requests</h2>
      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id} className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <div className="flex gap-4 items-start">
              {/* Provider Avatar */}
              {request.providerName && (
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={request.providerImage} alt={request.providerName} />
                  <AvatarFallback>
                    {request.providerName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{request.serviceCategory}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-2">{getStatusLabel(request.status)}</span>
                  </Badge>
                </div>

                {request.providerName && (
                  <p className="text-sm text-foreground font-semibold mb-3">
                    👤 {request.providerName}
                    {request.serviceType === "digital" ? " (Remote)" : " (Onsite)"}
                  </p>
                )}

                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
