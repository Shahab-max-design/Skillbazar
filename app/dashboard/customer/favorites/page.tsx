"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Phone } from "lucide-react"

interface SavedProfessional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  reviews: number
  location: string
  phone: string
  rate: number
  availability: "available" | "busy"
}

export default function FavoritesPage() {
  const { user } = useUser()

  const savedProfessionals: SavedProfessional[] = [
    {
      id: "1",
      name: "Ahmad Khan",
      skill: "Electrical Services",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      rating: 4.8,
      reviews: 24,
      location: "Gulberg, Lahore",
      phone: "+92 300 1234567",
      rate: 1500,
      availability: "available",
    },
    {
      id: "2",
      name: "Hassan Malik",
      skill: "Plumbing Services",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
      rating: 4.9,
      reviews: 18,
      location: "DHA, Lahore",
      phone: "+92 300 7654321",
      rate: 1200,
      availability: "busy",
    },
    {
      id: "3",
      name: "Web Solutions",
      skill: "Web Development",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebSolutions",
      rating: 4.7,
      reviews: 12,
      location: "Karachi",
      phone: "+92 21 1234567",
      rate: 5000,
      availability: "available",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Saved Professionals" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Saved Professionals</h1>
              <p className="text-muted-foreground">Your favorite professionals for quick access and re-hiring</p>
            </div>

            {/* Saved Professionals List */}
            {savedProfessionals.length > 0 ? (
              <div className="space-y-4">
                {savedProfessionals.map((prof) => (
                  <Card key={prof.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Professional Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={prof.image} alt={prof.name} />
                            <AvatarFallback className="bg-primary text-white font-bold">
                              {prof.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-foreground">{prof.name}</h3>
                              <Badge
                                className={
                                  prof.availability === "available"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }
                              >
                                {prof.availability === "available" ? "Available" : "Busy"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{prof.skill}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(prof.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {prof.rating} ({prof.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Contact */}
                      <div className="md:col-span-1">
                        <div className="flex items-start gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{prof.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${prof.phone}`} className="text-sm font-medium text-primary hover:underline">
                            {prof.phone}
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex flex-col gap-2">
                        <div className="text-right mb-2">
                          <p className="font-bold text-foreground">PKR {prof.rate.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Per hour/job</p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 w-full">Hire Again</Button>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed">
                <div className="text-5xl mb-4">❤️</div>
                <h2 className="text-xl font-bold text-foreground mb-2">No Saved Professionals</h2>
                <p className="text-muted-foreground mb-6">
                  Save your favorite professionals by clicking the heart icon on their profile for quick access later.
                </p>
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Explore Professionals
                </Button>
              </Card>
            )}

            {/* Tips Section */}
            <Card className="p-6 bg-primary/5 border-primary/10">
              <h3 className="font-bold text-foreground mb-3">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Save your favorite professionals for faster re-hiring</li>
                <li>✓ Check availability before placing a new booking</li>
                <li>✓ View complete profiles to see portfolios and detailed reviews</li>
                <li>✓ Compare ratings and rates among saved professionals</li>
              </ul>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
