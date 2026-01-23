"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MessageCircle, Clock, CheckCircle } from "lucide-react"

interface SupportTicket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  date: string
  priority: "low" | "medium" | "high"
  replies: number
  lastUpdate: string
}

export default function SupportPage() {
  const { user } = useUser()

  const supportTickets: SupportTicket[] = [
    {
      id: "TKT-001",
      title: "Payment not processed for last booking",
      description: "The payment for my electrical services booking on Jan 15 is still pending.",
      status: "in-progress",
      date: "2024-01-17",
      priority: "high",
      replies: 2,
      lastUpdate: "1 hour ago",
    },
    {
      id: "TKT-002",
      title: "Professional cancelled last minute",
      description: "Ahmad Khan cancelled the plumbing service just 30 minutes before the scheduled time.",
      status: "resolved",
      date: "2024-01-12",
      priority: "medium",
      replies: 4,
      lastUpdate: "2 days ago",
    },
    {
      id: "TKT-003",
      title: "Quality issue with web design work",
      description: "The website design doesn't match the requirements discussed initially.",
      status: "open",
      date: "2024-01-10",
      priority: "medium",
      replies: 1,
      lastUpdate: "5 days ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "in-progress":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Support & Help" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Support & Help Center</h1>
                <p className="text-muted-foreground">Get help, report issues, and file complaints</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Create New Ticket</Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-3xl mb-2">❓</div>
                <h3 className="font-bold text-foreground mb-1">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-3">Find answers to common questions</p>
                <Button variant="outline" size="sm" className="w-full">
                  View FAQ
                </Button>
              </Card>

              <Card className="p-4">
                <div className="text-3xl mb-2">📞</div>
                <h3 className="font-bold text-foreground mb-1">Contact Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                <Button variant="outline" size="sm" className="w-full">
                  Live Chat
                </Button>
              </Card>

              <Card className="p-4">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-bold text-foreground mb-1">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Get a response within 24 hours</p>
                <Button variant="outline" size="sm" className="w-full">
                  Send Email
                </Button>
              </Card>
            </div>

            {/* Support Tickets */}
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Your Support Tickets</h3>

              {supportTickets.length > 0 ? (
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-foreground">{ticket.id}</p>
                              <p className="text-sm font-semibold text-foreground">{ticket.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          </div>

                          <div className="text-right ml-4">
                            <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1 mb-2`}>
                              {getStatusIcon(ticket.status)}
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className={`font-semibold ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.toUpperCase()} Priority
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Created: {ticket.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {ticket.replies} replies
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">Updated: {ticket.lastUpdate}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No Support Tickets</h2>
                  <p className="text-muted-foreground mb-6">
                    Great! You don't have any open support tickets. If you need help, we're here for you.
                  </p>
                </Card>
              )}
            </div>

            {/* Contact Information */}
            <Card className="p-6 bg-primary/5 border-primary/10">
              <h3 className="font-bold text-lg text-foreground mb-4">Get in Touch</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-foreground mb-2">Email Support</p>
                  <p className="text-muted-foreground text-sm mb-3">support@skillbazar.pk</p>
                  <p className="text-xs text-muted-foreground">Response time: 24 hours</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-2">Phone Support</p>
                  <p className="text-muted-foreground text-sm mb-3">+92 (0) 300 1234567</p>
                  <p className="text-xs text-muted-foreground">Monday-Friday, 9 AM - 6 PM PKT</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-2">WhatsApp Support</p>
                  <p className="text-muted-foreground text-sm mb-3">+92 300 1234567</p>
                  <p className="text-xs text-muted-foreground">Quick responses, available 24/7</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-2">Live Chat</p>
                  <p className="text-muted-foreground text-sm mb-3">Available in your account</p>
                  <p className="text-xs text-muted-foreground">Response time: 5-10 minutes</p>
                </div>
              </div>
            </Card>

            {/* Common Issues */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">Common Issues & Solutions</h3>
              <div className="space-y-4">
                {[
                  { q: "How do I cancel a booking?", a: "You can cancel 2 hours before the scheduled time from your bookings page." },
                  { q: "What's the refund policy?", a: "Full refund if cancelled 2+ hours before, 50% if cancelled 1 hour before." },
                  { q: "How do I report a professional?", a: "Use the Report button on their profile or file a support ticket with details." },
                ].map((item, index) => (
                  <div key={index} className="pb-4 border-b border-border last:pb-0 last:border-0">
                    <p className="font-semibold text-foreground mb-2">{item.q}</p>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
