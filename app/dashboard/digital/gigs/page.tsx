"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Gig {
  id: string
  title: string
  description: string
  category: string
  price: number
  status: "active" | "inactive"
  orders: number
}

export default function DigitalGigsPage() {
  const router = useRouter()
  const { user } = useUser()
  
  const gigs: Gig[] = [
    {
      id: "1",
      title: "Web Development",
      description: "Custom website development",
      category: "Web Development",
      price: 500,
      status: "active",
      orders: 12,
    },
    {
      id: "2",
      title: "UI/UX Design",
      description: "Modern UI/UX design services",
      category: "Design",
      price: 300,
      status: "active",
      orders: 8,
    },
  ]

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
            <Button>+ Create New Gig</Button>
          </div>

          <div className="grid gap-6">
            {gigs.map(gig => (
              <div key={gig.id} className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{gig.title}</h3>
                      <p className="text-sm text-muted-foreground">{gig.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gig.status === "active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {gig.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-foreground">${gig.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="font-semibold text-foreground">{gig.orders}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
