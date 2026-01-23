"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"
import { karachiAreas, services } from "@/lib/data"

interface PostRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestCreated?: () => void
}

export function PostRequestModal({ open, onOpenChange, onRequestCreated }: PostRequestModalProps) {
  const { user, createServiceRequest } = useUser()
  const { toast } = useToast()
  
  const [serviceType, setServiceType] = useState<"digital" | "onsite">("digital")
  const [serviceCategory, setServiceCategory] = useState("")
  const [description, setDescription] = useState("")
  const [area, setArea] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a request",
        variant: "destructive",
      })
      return
    }

    if (!serviceCategory.trim() || !description.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (serviceType === "onsite" && !area.trim()) {
      toast({
        title: "Missing Field",
        description: "Please select an area for onsite services",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      createServiceRequest({
        customerId: user.email,
        serviceType,
        serviceCategory,
        description,
        area: serviceType === "onsite" ? area : undefined,
        status: "pending",
      })

      toast({
        title: "Success",
        description: "Service request posted successfully!",
      })

      // Reset form
      setServiceType("digital")
      setServiceCategory("")
      setDescription("")
      setArea("")
      onOpenChange(false)
      onRequestCreated?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = services.filter((s) => s !== "All Services")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Post New Service Request</DialogTitle>
          <DialogDescription>
            Tell us what service you need and how you prefer to work
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={(value) => setServiceType(value as "digital" | "onsite")}>
              <SelectTrigger id="serviceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital">📱 Digital (Remote)</SelectItem>
                <SelectItem value="onsite">📍 Onsite (Location-based)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            <Select value={serviceCategory} onValueChange={setServiceCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area (only for onsite) */}
          {serviceType === "onsite" && (
            <div className="space-y-2">
              <Label htmlFor="area">Service Area</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent>
                  {karachiAreas
                    .filter((a) => a !== "All Areas")
                    .map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you need in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Posting..." : "Post Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
