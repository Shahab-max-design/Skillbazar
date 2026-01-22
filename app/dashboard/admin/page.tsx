"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { adminTechnicians, dashboardStats } from "@/lib/data"
import { Users, UserCheck, Clock, Calendar, DollarSign, Activity, Shield, ShieldOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"

export default function AdminDashboardPage() {
  const { user } = useUser()
  const [technicians, setTechnicians] = useState(adminTechnicians)
  const stats = dashboardStats.admin

  const displayName = user?.name || "Admin User"

  const toggleVerification = (id: string) => {
    setTechnicians((prev) => prev.map((tech) => (tech.id === id ? { ...tech, verified: !tech.verified } : tech)))
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="admin" />

      <div className="lg:ml-64">
        <DashboardHeader title="Admin Dashboard" userName={displayName} userRole="Administrator" />

        <main className="p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard
              title="Total Technicians"
              value={stats.totalTechnicians}
              icon={<Users className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Verified"
              value={stats.verifiedTechnicians}
              icon={<UserCheck className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Pending Verification"
              value={stats.pendingVerifications}
              icon={<Clock className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              icon={<Calendar className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Monthly Revenue"
              value={`Rs. ${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
              icon={<DollarSign className="w-6 h-6" />}
              trend={{ value: 18, isPositive: true }}
              color="green"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              icon={<Activity className="w-6 h-6" />}
              color="primary"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
                <select className="bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground border-0">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="h-56 flex items-end justify-between gap-3">
                {[
                  { month: "Aug", value: 450000 },
                  { month: "Sep", value: 520000 },
                  { month: "Oct", value: 680000 },
                  { month: "Nov", value: 750000 },
                  { month: "Dec", value: 820000 },
                  { month: "Jan", value: 850000 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative">
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                        style={{ height: `${(item.value / 850000) * 180}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                    <span className="text-xs font-medium text-foreground">{(item.value / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Distribution */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Service Distribution</h3>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="20"
                    strokeDasharray="377"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray="377"
                    strokeDashoffset="113"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="20"
                    strokeDasharray="377"
                    strokeDashoffset="189"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="20"
                    strokeDasharray="377"
                    strokeDashoffset="264"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">100%</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Electrical", color: "bg-yellow-500", value: "30%" },
                  { name: "Plumbing", color: "bg-blue-500", value: "25%" },
                  { name: "AC Repair", color: "bg-green-500", value: "20%" },
                  { name: "Other", color: "bg-cyan-500", value: "25%" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technicians Table */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Technician Management</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{technicians.length} technicians</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Jobs
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {technicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tech.image || "/placeholder.svg"}
                            alt={tech.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-foreground">{tech.name}</div>
                            <div className="text-xs text-muted-foreground">{tech.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {tech.skill}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{tech.phone}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{tech.joinedDate}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{tech.completedJobs}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tech.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tech.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVerification(tech.id)}
                            className={tech.verified ? "text-amber-500" : "text-green-500"}
                          >
                            {tech.verified ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
