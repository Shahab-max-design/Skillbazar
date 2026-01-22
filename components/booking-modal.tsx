"use client"

import type React from "react"

import { useState } from "react"
import { X, CheckCircle, Calendar, Clock, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Technician } from "@/lib/data"

interface BookingModalProps {
  technician: Technician
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ technician, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("success")
    }, 1500)
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ name: "", phone: "", date: "", time: "", description: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {step === "form" ? (
          <>
            {/* Header */}
            <div className="bg-primary p-6">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-primary-foreground">Book {technician.name}</h2>
              <p className="text-primary-foreground/80 text-sm">{technician.skill}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      required
                      className="pl-10"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      required
                      className="pl-10"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Problem Description</label>
                <textarea
                  required
                  placeholder="Describe your issue..."
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground resize-none h-24 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Pricing Info */}
              <div className="bg-muted rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Visit Charge</span>
                  <span className="font-semibold text-foreground">Rs. {technician.rate.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Additional charges may apply based on work required
                </p>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your booking request has been sent to {technician.name}. You will receive a confirmation shortly.
            </p>
            <div className="bg-muted rounded-xl p-4 text-left mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Technician:</span>
                <span className="font-medium text-foreground">{technician.name}</span>
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">{technician.skill}</span>
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{formData.date}</span>
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{formData.time}</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
