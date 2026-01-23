"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, MapPin, CreditCard } from "lucide-react"

interface ProfileSection {
  title: string
  icon: React.ReactNode
  status: "complete" | "incomplete"
  percentage: number
  hint: string
}

export function ProfileCompletion() {
  const sections: ProfileSection[] = [
    {
      title: "Personal Information",
      icon: "👤",
      status: "complete",
      percentage: 100,
      hint: "Name, email, phone verified",
    },
    {
      title: "Address Book",
      icon: "📍",
      status: "incomplete",
      percentage: 50,
      hint: "Add delivery addresses",
    },
    {
      title: "Payment Methods",
      icon: "💳",
      status: "incomplete",
      percentage: 25,
      hint: "Add credit/debit cards",
    },
    {
      title: "Security Settings",
      icon: "🔒",
      status: "complete",
      percentage: 100,
      hint: "Two-factor authentication enabled",
    },
  ]

  const totalPercentage: number = 75

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-foreground mb-4">Profile Completion</h3>

      {/* Overall Progress */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Overall Completion</p>
            <p className="text-3xl font-bold text-primary">{totalPercentage}%</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {totalPercentage >= 100 ? "Complete" : "In Progress"}
          </Badge>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${totalPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Complete your profile for better service matching</p>
      </div>

      {/* Profile Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-grow">
                <span className="text-xl mt-1">{section.icon}</span>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-sm">{section.title}</p>
                    {section.status === "complete" && (
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{section.hint}</p>
                </div>
              </div>

              <div className="text-right ml-2">
                <p className="text-sm font-semibold text-foreground">{section.percentage}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 pt-6 border-t border-border">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Manage Addresses
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Security Settings
        </Button>
      </div>
    </Card>
  )
}
