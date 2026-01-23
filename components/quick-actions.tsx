"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onPostRequest?: () => void
  onViewRequests?: () => void
  onViewComplaints?: () => void
}

export function QuickActions({ onPostRequest, onViewRequests, onViewComplaints }: QuickActionsProps) {
  const actions = [
    {
      icon: "🔍",
      title: "Find Services",
      description: "Browse professionals",
      onClick: () => console.log("Find Services"),
    },
    {
      icon: "📝",
      title: "Post New Request",
      description: "Get help with a task",
      onClick: onPostRequest,
    },
    {
      icon: "🧾",
      title: "My Requests",
      description: "Track your requests",
      onClick: onViewRequests,
    },
    {
      icon: "❓",
      title: "Support & Complaints",
      description: "Report issues",
      onClick: onViewComplaints,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          variant="outline"
          className="h-auto flex flex-col items-center justify-center py-6 gap-2 hover:bg-primary/5 transition-colors"
        >
          <span className="text-3xl">{action.icon}</span>
          <span className="font-semibold text-sm text-center leading-tight">
            {action.title}
          </span>
          <span className="text-xs text-muted-foreground">{action.description}</span>
        </Button>
      ))}
    </div>
  )
}
