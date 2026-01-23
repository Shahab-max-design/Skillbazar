"use client"

import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, MessageCircle, Send } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: string
  subject: string
  preview: string
  timestamp: string
  unread: boolean
}

export default function TechnicianMessagesPage() {
  const router = useRouter()
  const { user } = useUser()

  const messages: Message[] = [
    {
      id: "1",
      sender: "Ahmed Hassan",
      subject: "Electrical Repair Confirmation",
      preview: "Can you confirm the time for tomorrow's electrical repair?",
      timestamp: "1 hour ago",
      unread: true,
    },
    {
      id: "2",
      sender: "Fatima Khan",
      subject: "Plumbing Job Completed",
      preview: "Thank you for fixing the plumbing issue so quickly!",
      timestamp: "3 hours ago",
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Messages" 
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

          <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-2">
              <h2 className="font-semibold text-foreground mb-4">Conversations</h2>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    msg.unread
                      ? "bg-primary/5 border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground">{msg.sender}</p>
                  <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-background rounded-lg border border-border flex flex-col h-96 lg:h-auto">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Ahmed Hassan</h3>
                <p className="text-sm text-muted-foreground">Last seen 1 hour ago</p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-foreground">Can you confirm the time for tomorrow's electrical repair?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-primary-foreground">Yes, I'll be there at 2 PM tomorrow. Thanks!</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <Input placeholder="Type your message..." />
                <Button size="sm" className="px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
