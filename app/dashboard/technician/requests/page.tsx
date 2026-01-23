"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

interface JobRequest {
  id: string
  customerName: string
  service: string
  area: string
  description: string
  budget: string
  status: "new" | "viewed"
}

export default function TechnicianRequestsPage() {
  const router = useRouter()
  const { user } = useUser()

  const requests: JobRequest[] = [
    {
      id: "1",
      customerName: "Ahmed Hassan",
      service: "Electrical Repair",
      area: "DHA",
      description: "Fixing electrical outlet in kitchen",
      budget: "PKR 2,000",
      status: "new",
    },
    {
      id: "2",
      customerName: "Fatima Khan",
      service: "Plumbing",
      area: "Clifton",
      description: "Water leak repair in bathroom",
      budget: "PKR 3,500",
      status: "viewed",
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Job Requests" 
          userName={user?.name || "Technician"} 
          userRole="Onsite Technician" 
        />

        <main className="p-4 lg:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Job Requests</h1>

          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div>
                      {req.status === "new" ? (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{req.service}</h3>
                      <p className="text-sm text-muted-foreground">by {req.customerName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === "new"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-foreground mb-4">{req.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold text-foreground">{req.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold text-foreground">{req.budget}</p>
                    </div>
                  </div>
                  <Button>Accept Job</Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
