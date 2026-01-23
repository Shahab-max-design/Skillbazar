"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { technicians } from "@/lib/data"
import { Star, MapPin, Phone, Mail, Heart, CheckCircle, Briefcase } from "lucide-react"

export default function ProfessionalDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  // Find professional by ID from params
  const profId = params.id as string
  const professional = technicians.find((tech) => tech.id === profId)

  if (!professional) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar type="customer" />
        <div className="lg:ml-64">
          <DashboardHeader title="Professional Profile" userName="Customer" userRole="Customer" />
          <main className="p-4 lg:p-8">
            <Card className="p-12 text-center border-dashed">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-foreground mb-2">Professional Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The professional you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Back to Services
              </Button>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const handleContact = () => {
    toast({
      title: "Contact Request",
      description: `Starting chat with ${professional.name}...`,
    })
  }

  const handleBooking = () => {
    toast({
      title: "Booking",
      description: `Initiating booking with ${professional.name}...`,
    })
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${professional.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    })
  }

  const initials = professional.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Professional Profile" userName="Customer" userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="max-w-4xl space-y-6">
            {/* Header Card */}
            <Card className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={professional.image} alt={professional.name} />
                    <AvatarFallback className="text-lg font-bold bg-primary text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info Section */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-1">{professional.name}</h1>
                      <p className="text-lg text-primary font-semibold">{professional.skill}</p>
                    </div>
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full transition-all ${
                        isFavorite
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className="h-6 w-6"
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* Availability & Type */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.available && (
                      <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Available Now
                      </Badge>
                    )}
                    <Badge variant="outline">{professional.type === "digital" ? "🌐 Remote" : "📍 Onsite"}</Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(professional.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-foreground">
                        {professional.rating.toFixed(1)} ({professional.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{professional.completedJobs}</div>
                <p className="text-sm text-muted-foreground">Jobs Completed</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{professional.experience}</div>
                <p className="text-sm text-muted-foreground">Experience</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">PKR {professional.rate}</div>
                <p className="text-sm text-muted-foreground">Rate</p>
              </Card>
            </div>

            {/* Details Section */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">About</h3>
                <p className="text-muted-foreground">
                  Highly skilled {professional.skill} with {professional.experience} of experience. 
                  Specialized in delivering quality work with {professional.completedJobs}+ completed projects.
                </p>
              </div>

              {/* Location Info for Onsite */}
              {professional.type === "onsite" && professional.areas && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.areas.map((area) => (
                      <Badge key={area} variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {["Reliable", "Professional", "High Quality", "On-time Delivery"].map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleContact}
                variant="outline"
                className="h-12 text-base font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Contact Professional
              </Button>
              <Button
                onClick={handleBooking}
                className="h-12 text-base font-semibold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Briefcase className="h-5 w-5" />
                Book Service
              </Button>
            </div>

            {/* Reviews Section */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="pb-4 border-b border-border last:pb-0 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">Anonymous Customer</p>
                        <p className="text-sm text-muted-foreground">2 weeks ago</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Excellent work! Very professional and delivered on time. Highly recommended.
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
