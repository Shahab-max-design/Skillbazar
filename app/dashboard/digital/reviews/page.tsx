"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Star } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Review {
  id: string
  clientName: string
  gig: string
  rating: number
  comment: string
  date: string
}

export default function DigitalReviewsPage() {
  const router = useRouter()
  const { user } = useUser()

  const reviews: Review[] = [
    {
      id: "1",
      clientName: "Tech Startup Inc",
      gig: "Web Development",
      rating: 5,
      comment: "Excellent work! The website looks amazing and works perfectly.",
      date: "2024-01-20",
    },
    {
      id: "2",
      clientName: "Design Agency",
      gig: "UI/UX Design",
      rating: 4.5,
      comment: "Great design skills and communication. Would work again!",
      date: "2024-01-18",
    },
  ]

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Reviews" 
          userName={user?.name || "Digital Provider"} 
          userRole="Digital Provider" 
        />

        <main className="p-4 lg:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Reviews & Ratings</h1>

          {/* Rating Summary */}
          <div className="bg-background rounded-lg border border-border p-8 mb-8">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-5xl font-bold text-foreground">{averageRating}</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(parseFloat(averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">{reviews.length} total reviews</p>
                <p className="text-muted-foreground">Based on all orders</p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.clientName}</h3>
                    <p className="text-sm text-muted-foreground">{review.gig}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                  </div>
                </div>

                <p className="text-foreground text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
