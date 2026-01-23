"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface PreviousProfessional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  completedJobs: number
  lastHired: string
}

const previousProfessionals: PreviousProfessional[] = [
  {
    id: "1",
    name: "Ahmad Khan",
    skill: "Electrical Services",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    rating: 4.8,
    completedJobs: 12,
    lastHired: "2 weeks ago",
  },
  {
    id: "2",
    name: "Hassan Malik",
    skill: "Plumbing Services",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
    rating: 4.9,
    completedJobs: 8,
    lastHired: "1 month ago",
  },
  {
    id: "3",
    name: "Web Solutions",
    skill: "Web Development",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebSolutions",
    rating: 4.7,
    completedJobs: 5,
    lastHired: "3 weeks ago",
  },
]

export function QuickRehireList() {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-foreground mb-4">Quick Re-hire List</h3>
      <div className="space-y-4">
        {previousProfessionals.map((prof) => (
          <div key={prof.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border">
            {/* Professional info */}
            <div className="flex items-center gap-3 flex-grow">
              <Avatar className="h-10 w-10">
                <AvatarImage src={prof.image} alt={prof.name} />
                <AvatarFallback className="bg-primary text-white text-xs font-bold">
                  {prof.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-grow">
                <p className="font-semibold text-foreground text-sm">{prof.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{prof.skill}</span>
                  <span>•</span>
                  <span>{prof.completedJobs} jobs</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{prof.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hire again button */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 whitespace-nowrap ml-2"
              onClick={() => {
                // Future: Trigger booking flow
                console.log(`Hire ${prof.name} again`)
              }}
            >
              Hire Again
            </Button>
          </div>
        ))}
      </div>

      {/* View all button */}
      <Button variant="outline" className="w-full mt-4">
        View All Professionals
      </Button>
    </Card>
  )
}
