"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useUser, UserData } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"
import { Upload, LogOut } from "lucide-react"
import Link from "next/link"

interface ProfileWidgetProps {
  onEditClick?: () => void
}

export function ProfileWidget({ onEditClick }: ProfileWidgetProps) {
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!user) return null

  // Calculate profile completion percentage
  const fields = [user.name, user.email, user.phone, user.profilePicture]
  const completedFields = fields.filter(Boolean).length
  const completionPercentage = Math.round((completedFields / fields.length) * 100)

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Convert to data URL (for localStorage compatibility)
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const updatedUser = { ...user, profilePicture: dataUrl }
      updateUser(updatedUser)

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })

      setIsUploading(false)

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear()
      window.location.href = "/auth/signin"
    }
  }

  return (
    <Card className="p-6 sticky top-4">
      <div className="text-center space-y-4">
        {/* Avatar with Upload */}
        <div className="relative inline-block group">
          <Avatar className="w-20 h-20 border-4 border-green-200 group-hover:border-green-400 transition-colors cursor-pointer">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* Upload Overlay */}
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Click to upload profile picture"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>

        {/* Name & Email */}
        <div className="w-full overflow-hidden">
          <h3 className="font-semibold text-foreground truncate">{user.name || "User"}</h3>
          <p className="text-xs text-muted-foreground truncate w-full">{user.email}</p>
          {user.phone && <p className="text-xs text-muted-foreground truncate">{user.phone}</p>}
        </div>

        {/* Profile Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-semibold text-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Credits Display */}
        {user.credits !== undefined && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-muted-foreground mb-1">Available Credits</p>
            <p className="text-xl font-bold text-green-600">{user.credits} PKR</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button onClick={onEditClick} variant="outline" className="w-full">
            ✏️ Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-2 border-t text-xs space-y-1">
          <Link href="/dashboard/customer/wallet" className="block text-green-600 hover:underline">
            💳 Wallet
          </Link>
          <Link href="/dashboard/customer/support" className="block text-green-600 hover:underline">
            🆘 Support
          </Link>
        </div>
      </div>
    </Card>
  )
}
