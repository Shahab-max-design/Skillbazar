"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Briefcase, MapPin, Calendar } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Job {
  id: string
  customerName: string
  service: string
  area: string
  scheduledDate: string
  status: "upcoming" | "in-progress" | "completed"
}

export default function TechnicianJobsPage() {
  const router = useRouter()
  const { user } = useUser()

  const jobs: Job[] = [
    {
      id: "1",
      customerName: "Ahmed Hassan",
      service: "Electrical Repair",
      area: "DHA",
      scheduledDate: "2024-01-28",
      status: "upcoming",
    },
    {
      id: "2",
      customerName: "Fatima Khan",
      service: "Plumbing",
      area: "Clifton",
      scheduledDate: "2024-01-27",
      status: "in-progress",
    },
    {
      id: "3",
      customerName: "Hassan Ali",
      service: "AC Repair",
      area: "Defence",
      scheduledDate: "2024-01-25",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="My Jobs" 
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

          <h1 className="text-3xl font-bold text-foreground mb-8">My Jobs</h1>

          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{job.service}</h3>
                      <p className="text-sm text-muted-foreground">for {job.customerName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : job.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.area}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {job.scheduledDate}
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
