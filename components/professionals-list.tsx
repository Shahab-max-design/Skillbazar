"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone } from "lucide-react"

interface Professional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  reviews: number
  available: boolean
  experience: string
  completedJobs: number
  phone: string
  rate: number
  areas?: string[]
  type: "digital" | "onsite"
}

interface ProfessionalsListProps {
  professionals: Professional[]
  selectedCategory: string
  onSelectProfessional?: (professional: Professional) => void
  isLoading?: boolean
}

export function ProfessionalsList({
  professionals,
  selectedCategory,
  onSelectProfessional,
  isLoading,
}: ProfessionalsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (professionals.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-foreground mb-2">No Results Found</h3>
        <p className="text-muted-foreground">
          We couldn't find professionals matching your search. Try adjusting your filters or search terms.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available {selectedCategory}s</h2>
          <p className="text-muted-foreground">
            Found {professionals.length} professional{professionals.length !== 1 ? "s" : ""} matching your search
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {professionals.map((professional) => (
          <Card
            key={professional.id}
            className="p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex gap-6 items-start">
              {/* Avatar */}
              <Avatar className="w-20 h-20 flex-shrink-0 border-2 border-primary/10">
                <AvatarImage src={professional.image} alt={professional.name} />
                <AvatarFallback>
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Name & Availability */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{professional.name}</h3>
                  {professional.available && (
                    <Badge className="bg-green-100 text-green-700 flex-shrink-0">✓ Available</Badge>
                  )}
                </div>

                {/* Skill & Experience */}
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span className="font-semibold text-foreground">{professional.skill}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{professional.experience}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{professional.completedJobs} jobs completed</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(professional.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{professional.rating}</span>
                  <span className="text-xs text-muted-foreground">({professional.reviews} reviews)</span>
                </div>

                {/* Type & Location/Rate */}
                <div className="flex flex-wrap gap-4 items-center text-sm mb-4">
                  <Badge variant="outline">
                    {professional.type === "digital" ? "📱 Digital" : "📍 Onsite"}
                  </Badge>
                  {professional.type === "onsite" && professional.areas && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {professional.areas.slice(0, 2).join(", ")}
                      {professional.areas.length > 2 && `+${professional.areas.length - 2}`}
                    </div>
                  )}
                  {professional.type === "digital" && (
                    <span className="text-muted-foreground">Rs. {professional.rate}/hour</span>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => onSelectProfessional?.(professional)}
                    className="gap-2"
                  >
                    View Profile & Hire
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Right Side - Rate/Quick Stats */}
              <div className="text-right flex-shrink-0 hidden md:block">
                <div className="text-2xl font-bold text-primary mb-2">
                  Rs. {professional.rate}
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  {professional.type === "digital" ? "per hour" : "per task"}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-foreground font-semibold">{professional.completedJobs} jobs</div>
                  <div className="text-muted-foreground">{professional.experience}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
