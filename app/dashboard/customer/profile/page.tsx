"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser, UserData } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, User as UserIcon } from "lucide-react"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardSidebar type="customer" />
        <div className="lg:ml-64">
          <DashboardHeader title="Profile" userName="" userRole="Customer" />
          <main className="p-4 lg:p-8">
            <p>Loading...</p>
          </main>
        </div>
      </div>
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  // Calculate profile completion
  const fields = [user.name, user.email, user.phone, user.profilePicture]
  const completedFields = fields.filter(Boolean).length
  const completionPercentage = Math.round((completedFields / fields.length) * 100)

  const handleProfileSave = (updatedUser: UserData) => {
    updateUser(updatedUser)
    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Profile" userName={user.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* Profile Section */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Avatar */}
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-green-200 self-center md:self-start">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">Customer Account</p>

                {/* Completion */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profile Completion</span>
                    <span className="font-semibold text-foreground">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <EditProfileDialog user={user} onSave={handleProfileSave} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground mb-4">Contact Information</h3>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-foreground">{user.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="font-medium text-foreground">Customer</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Credits Section */}
          <Card className="p-8">
            <h3 className="font-bold text-foreground mb-4">Account Balance</h3>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
              <p className="text-3xl font-bold text-green-600 mb-4">{user.credits || 0} PKR</p>
              <Button className="bg-green-600 hover:bg-green-700">Add Funds</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
