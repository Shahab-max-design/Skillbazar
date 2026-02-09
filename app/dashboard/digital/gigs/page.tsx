"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, Edit, Trash2, Eye } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { CreateGigModal } from "@/components/create-gig-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Gig {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  startingPrice: number
  deliveryTime: string
  tags: string[]
  status: "active" | "draft" | "inactive"
  images: string[]
  rating: number
  reviews: number
  orders: number
  createdAt: string
}

export default function DigitalGigsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadGigs = () => {
    const stored = localStorage.getItem("providerGigs")
    if (stored) {
      try {
        const allGigs: Gig[] = JSON.parse(stored)
        setGigs(allGigs)
      } catch (e) {
        console.error("Failed to parse gigs", e)
      }
    }
  }

  useEffect(() => {
    loadGigs()
    // Listen for new gigs
    window.addEventListener("new-gig-created", loadGigs)
    return () => {
      window.removeEventListener("new-gig-created", loadGigs)
    }
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gig?")) {
      const stored = localStorage.getItem("providerGigs")
      if (stored) {
        const allGigs: Gig[] = JSON.parse(stored)
        const updatedGigs = allGigs.filter(g => g.id !== id)
        localStorage.setItem("providerGigs", JSON.stringify(updatedGigs))
        window.dispatchEvent(new Event("new-gig-created"))
        loadGigs()
      }
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader
          title="My Gigs"
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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Gigs</h1>
              <p className="text-muted-foreground">Manage your services and gigs</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>+ Create New Gig</Button>
          </div>

          {gigs.length === 0 ? (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No Gigs Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first gig to start receiving orders.</p>
                <Button onClick={() => setIsModalOpen(true)}>Create Your First Gig</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gigs.map(gig => (
                <Card key={gig.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={gig.images[0] || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={
                        gig.status === "active"
                          ? "bg-green-500 text-white"
                          : gig.status === "draft"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-500 text-white"
                      }>
                        {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground text-lg line-clamp-1">{gig.title}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{gig.category}</p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{gig.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Starting at</p>
                        <p className="font-bold text-foreground">PKR {gig.startingPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery</p>
                        <p className="font-semibold text-foreground">{gig.deliveryTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        {gig.orders} orders
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(gig.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateGigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadGigs()}
      />
    </div>
  )
}
