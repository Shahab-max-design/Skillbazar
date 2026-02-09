"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/use-user"
import { ArrowLeft, User, Mail, Phone, Link as LinkIcon } from "lucide-react"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"

export default function DigitalProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    portfolioLink: user?.portfolioLink || "",
    bio: (user as any)?.bio || "",
    profilePicture: user?.profilePicture || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    if (user) {
      updateUser({
        ...user,
        ...formData
      })
      setIsEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="digital" />

      <div className="lg:ml-64">
        <DashboardHeader
          title="Profile"
          userName={user?.name || "Digital Provider"}
          userRole="Digital Provider"
        />

        <main className="p-4 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Profile Information
            </h1>
            <p className="text-muted-foreground">
              Manage your profile details and professional information
            </p>
          </div>

          {/* Profile Form */}
          <div className="grid gap-6 max-w-2xl">
            {/* Profile Card */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <ProfilePictureUpload
                    currentImage={formData.profilePicture || user?.profilePicture}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, profilePicture: url }))}
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {user?.name || "Digital Provider"}
                    </h2>
                    <p className="text-sm text-muted-foreground">Digital Skills Provider</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "destructive" : "default"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-lg"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-lg"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-lg"
                    placeholder="+92 300 1234567"
                  />
                </div>

                {/* Portfolio Link */}
                <div>
                  <Label htmlFor="portfolioLink" className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Portfolio Link
                  </Label>
                  <Input
                    id="portfolioLink"
                    name="portfolioLink"
                    type="url"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-lg"
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded-lg min-h-24"
                    placeholder="Tell clients about your skills and experience"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Gigs</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">$2,450</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold text-foreground">4.8★</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold text-foreground">25</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
