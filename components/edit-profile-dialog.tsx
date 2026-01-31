"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit2 } from "lucide-react"
import { UserData } from "@/hooks/use-user"
import { karachiAreas } from "@/lib/data"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"

const ONSITE_SERVICES = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Carpenter",
  "Painter",
  "Appliance Repair",
  "Locksmith",
  "Pest Control",
]

const DIGITAL_SKILLS = [
  "Web Development",
  "Graphic Design",
  "UI/UX Design",
  "SEO",
  "Content Writing",
  "Video Editing",
  "Digital Marketing",
  "Data Analysis",
]

interface EditProfileDialogProps {
  user: UserData
  onSave: (updatedUser: UserData) => void
}

export function EditProfileDialog({ user, onSave }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    ...user,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    area: user.area || "",
    profilePicture: user.profilePicture || "",
    onsiteServices: user.onsiteServices || [],
    digitalSkills: user.digitalSkills || [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profilePicture: url }))
  }

  const toggleService = (service: string) => {
    if (user.serviceType === "onsite") {
      setFormData((prev) => ({
        ...prev,
        onsiteServices: (prev.onsiteServices || []).includes(service)
          ? (prev.onsiteServices || []).filter((s) => s !== service)
          : [...(prev.onsiteServices || []), service],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        digitalSkills: (prev.digitalSkills || []).includes(service)
          ? (prev.digitalSkills || []).filter((s) => s !== service)
          : [...(prev.digitalSkills || []), service],
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) newErrors.name = "Name is required"
    if (!formData.email?.trim()) newErrors.email = "Email is required"
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required"

    if (user.serviceType === "onsite") {
      if (!formData.area) newErrors.area = "Area is required"
      if ((formData.onsiteServices || []).length === 0) newErrors.services = "Please select at least one service"
    } else if (user.serviceType === "digital") {
      if ((formData.digitalSkills || []).length === 0) newErrors.skills = "Please select at least one skill"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return
    onSave(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and service details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Profile Picture Upload Section */}
          <ProfilePictureUpload
            currentImage={formData.profilePicture}
            onUploadComplete={handleImageUpload}
          />

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="rounded-lg border-border"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="rounded-lg border-border"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+92 300 1234567"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="rounded-lg border-border"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Service Type - Display Only */}
            {user.serviceType === "onsite" && (
              <>
                {/* Area - Onsite Only */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium">
                    Service Area
                  </Label>
                  <Select
                    value={formData.area || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, area: value }))}
                  >
                    <SelectTrigger id="area" className="rounded-lg border-border">
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent>
                      {karachiAreas.filter((a) => a !== "All Areas").map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>

                {/* Onsite Services */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Services You Offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ONSITE_SERVICES.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`p-2 rounded-lg border-2 transition-all text-xs font-medium flex items-center gap-2 ${(formData.onsiteServices || []).includes(service)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                          }`}
                      >
                        {(formData.onsiteServices || []).includes(service) && "✓"}
                        {service}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
                </div>
              </>
            )}

            {user.serviceType === "digital" && (
              <>
                {/* Digital Skills */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Skills You Offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIGITAL_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleService(skill)}
                        className={`p-2 rounded-lg border-2 transition-all text-xs font-medium flex items-center gap-2 ${(formData.digitalSkills || []).includes(skill)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                          }`}
                      >
                        {(formData.digitalSkills || []).includes(skill) && "✓"}
                        {skill}
                      </button>
                    ))}
                  </div>
                  {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
