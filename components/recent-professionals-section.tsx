"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, X } from "lucide-react"
import { useRecentProfessionals } from "@/hooks/use-recent-professionals"

export function RecentProfessionalsSection() {
  const router = useRouter()
  const { professionals, removeProfessional, isLoading } = useRecentProfessionals()

  const handleProfessionalClick = (id: string) => {
    router.push(`/technicians/${id}`)
  }

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeProfessional(id)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (professionals.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Recent Professionals</h2>
          <p className="text-muted-foreground">Professionals you've viewed will appear here</p>
        </div>

        <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Recent Professionals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Browse our categories to discover and view professionals. They'll appear here for quick re-engagement.
          </p>
          <Button
            onClick={() => router.push("/technicians")}
            className="bg-green-600 hover:bg-green-700"
          >
            Explore Professionals
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Recent Professionals</h2>
          <p className="text-muted-foreground">Quickly re-hire trusted professionals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.slice(0, 6).map((professional) => (
          <Card
            key={professional.id}
            className="p-5 hover:shadow-lg hover:border-green-500 transition-all duration-300 cursor-pointer relative group"
            onClick={() => handleProfessionalClick(professional.id)}
          >
            {/* Remove Button */}
            <button
              onClick={(e) => handleRemove(professional.id, e)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
              aria-label="Remove from recent"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-green-200">
                <AvatarImage src={professional.image} alt={professional.name} />
                <AvatarFallback>
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-bold text-foreground line-clamp-2">{professional.name}</h3>
                <p className="text-sm text-muted-foreground">{professional.skill}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-foreground">{professional.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({professional.reviews} reviews)</span>
            </div>

            {/* Type Badge */}
            <div className="flex gap-2 mb-4">
              <Badge
                className={
                  professional.type === "digital"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-cyan-100 text-cyan-700"
                }
                variant="secondary"
              >
                {professional.type === "digital" ? "Digital" : "Onsite"}
              </Badge>
            </div>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="w-full border-green-200 hover:bg-green-50 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation()
                handleProfessionalClick(professional.id)
              }}
            >
              View Profile
            </Button>
          </Card>
        ))}
      </div>

      {professionals.length > 6 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => router.push("/technicians?recent=true")}
          >
            View All {professionals.length} Recent Professionals
          </Button>
        </div>
      )}
    </div>
  )
}
