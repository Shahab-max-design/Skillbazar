"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Professional {
  id: string
  name: string
  skill: string
  image?: string
  rating: number
  reviews: number
  type: "digital" | "onsite"
}

interface RecentProfessionalsProps {
  professionals: Professional[]
  onSelectProfessional?: (professional: Professional) => void
}

export function RecentProfessionals({ professionals, onSelectProfessional }: RecentProfessionalsProps) {
  if (professionals.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Recently Viewed Professionals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.map((professional) => (
          <Card
            key={professional.id}
            className="p-5 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onSelectProfessional?.(professional)}
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
                <AvatarImage src={professional.image} alt={professional.name} />
                <AvatarFallback>
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="text-center space-y-2 mb-4">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {professional.name}
              </h3>
              <p className="text-sm text-muted-foreground">{professional.skill}</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(professional.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground">
                  {professional.rating} ({professional.reviews})
                </span>
              </div>

              {/* Type Badge */}
              <Badge variant="outline" className="mx-auto">
                {professional.type === "digital" ? "📱 Digital" : "📍 Onsite"}
              </Badge>
            </div>

            {/* CTA */}
            <Button
              className="w-full"
              onClick={() => onSelectProfessional?.(professional)}
            >
              View Profile
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
