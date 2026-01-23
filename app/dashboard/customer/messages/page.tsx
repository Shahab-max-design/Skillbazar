"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ChatConversation {
  id: string
  professional: string
  skill: string
  image: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export default function MessagesPage() {
  const { user } = useUser()

  const conversations: ChatConversation[] = [
    {
      id: "1",
      professional: "Ahmad Khan",
      skill: "Electrical Services",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      lastMessage: "I'll be there in 15 minutes",
      timestamp: "2 mins ago",
      unread: 1,
      online: true,
    },
    {
      id: "2",
      professional: "Hassan Malik",
      skill: "Plumbing Services",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
      lastMessage: "Thanks for booking! See you tomorrow",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      professional: "Web Solutions Team",
      skill: "Web Development",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebSolutions",
      lastMessage: "Your website design is ready for review",
      timestamp: "3 hours ago",
      unread: 2,
      online: true,
    },
  ]

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Messages" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
                <p className="text-muted-foreground">Chat with professionals and service providers</p>
              </div>
              {totalUnread > 0 && (
                <Badge className="bg-red-50 text-red-700 border-red-200 text-sm px-3 py-1">
                  {totalUnread} unread
                </Badge>
              )}
            </div>

            {/* Chat Conversations */}
            <div className="space-y-3">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-primary"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with online status */}
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.image} alt={conv.professional} />
                          <AvatarFallback className="bg-primary text-white text-sm font-bold">
                            {conv.professional.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Message content */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{conv.professional}</p>
                            {conv.online && (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">Online</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <Badge className="bg-primary text-white ml-2">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center border-dashed">
                  <div className="text-5xl mb-4">💬</div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No Messages Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Start a conversation by contacting a professional. Your messages will appear here.
                  </p>
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    Find Professionals
                  </Button>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-primary/5 border-primary/10">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline">Search Conversations</Button>
                <Button variant="outline">Message Settings</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
