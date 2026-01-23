"use client"

import { UserData } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface ProfileSnapshotProps {
  user: UserData | null
  onEditClick?: () => void
}

export function ProfileSnapshot({ user, onEditClick }: ProfileSnapshotProps) {
  if (!user) return null

  // Calculate profile completion percentage
  const fields = [
    user.name,
    user.email,
    user.phone,
    user.profilePicture,
  ]
  const completedFields = fields.filter(Boolean).length
  const completionPercentage = Math.round((completedFields / fields.length) * 100)

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <Card className="p-6 sticky top-4">
      <div className="text-center space-y-4">
        {/* Avatar */}
        <Avatar className="w-20 h-20 mx-auto border-4 border-primary/10">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Name */}
        <div>
          <h3 className="font-semibold text-foreground">{user.name || "User"}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        {/* Profile Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-semibold text-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Edit Profile Button */}
        <Button
          onClick={onEditClick}
          variant="outline"
          className="w-full"
        >
          ✏️ Edit Profile
        </Button>
      </div>
    </Card>
  )
}
