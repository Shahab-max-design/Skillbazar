"use client"

import { useState } from "react"
import { Complaint } from "@/hooks/use-user"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface ComplaintsProps {
  complaints: Complaint[]
  onComplaintCreated?: () => void
}

export function Complaints({ complaints, onComplaintCreated }: ComplaintsProps) {
  const { user, createComplaint } = useUser()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to file a complaint",
        variant: "destructive",
      })
      return
    }

    if (!subject.trim() || !description.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      createComplaint(subject, description)
      toast({
        title: "Success",
        description: "Your complaint has been submitted successfully",
      })

      setSubject("")
      setDescription("")
      setModalOpen(false)
      onComplaintCreated?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700"
  }

  return (
    <div className="space-y-6">
      {/* Submit Complaint Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Complaints & Support</h3>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <span>+</span> New Complaint
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Complaint</DialogTitle>
            <DialogDescription>
              Tell us about any issues you've experienced
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief complaint subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h4 className="text-lg font-semibold text-foreground mb-2">All Clear!</h4>
          <p className="text-muted-foreground">
            You have no complaints. If you experience any issues, we're here to help.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{complaint.subject}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                  <span className="text-xs text-muted-foreground">
                    📅 {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status === "pending" ? "🔄 Pending" : "✅ Resolved"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
