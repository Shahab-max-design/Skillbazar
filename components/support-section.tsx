"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useComplaints } from "@/hooks/use-complaints"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Phone, Mail, Send, Check } from "lucide-react"

export function SupportSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  })

  const { user } = useUser()
  const { submitComplaint } = useComplaints()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

      submitComplaint({
        subject: formData.subject,
        description: formData.description,
        email: user?.email || "no-email@skillbazaar.com",
      })

      setSubmitted(true)
      toast({
        title: "Success",
        description: "Your complaint has been submitted. Our support team will assist you soon.",
      })

      // Reset form and close after 2 seconds
      setTimeout(() => {
        setFormData({ subject: "", description: "" })
        setSubmitted(false)
        setIsOpen(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Need Help?</h2>
        <p className="text-muted-foreground">We're here to support you 24/7</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Live Chat Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with our support team</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Available: Mon-Fri, 9AM-6PM</p>
          <Button variant="outline" className="w-full border-blue-300 hover:bg-blue-100">
            Start Chat
          </Button>
        </Card>

        {/* Phone Support Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Phone Support</h3>
              <p className="text-sm text-muted-foreground">Call our helpline</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground mb-4">+92 300 1234567</p>
          <Button variant="outline" className="w-full border-green-300 hover:bg-green-100">
            Call Now
          </Button>
        </Card>

        {/* Submit Complaint Card */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Submit Complaint</h3>
              <p className="text-sm text-muted-foreground">Report an issue or feedback</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">We respond within 24 hours</p>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            File Complaint
          </Button>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h3 className="font-bold text-foreground mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">How do I hire a professional?</p>
            <p className="text-xs text-muted-foreground">
              Browse categories, view professional profiles, and click "Hire" to request their services.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">What payment methods do you accept?</p>
            <p className="text-xs text-muted-foreground">
              We accept card payments, online transfers, and digital wallets for convenient transactions.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">Can I cancel a booking?</p>
            <p className="text-xs text-muted-foreground">
              Yes, you can cancel bookings up to 24 hours before the scheduled time.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground mb-1">How are professionals verified?</p>
            <p className="text-xs text-muted-foreground">
              All professionals go through background checks and skill verification before joining.
            </p>
          </div>
        </div>
      </div>

      {/* Complaint Submission Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Complaint</DialogTitle>
            <DialogDescription>
              Help us improve by reporting any issues or feedback you have.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Complaint Submitted!</h3>
              <p className="text-sm text-muted-foreground text-center">
                Thank you for your feedback. Our team will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-foreground font-semibold">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., Unprofessional service, Late arrival"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground font-semibold">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the issue in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={4}
                  className="mt-1.5 w-full px-3 py-2 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Complaint
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
