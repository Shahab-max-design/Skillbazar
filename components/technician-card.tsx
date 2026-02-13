"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, MapPin, Clock } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { AuthModal } from "@/components/auth-modal"
import type { Technician } from "@/lib/data"
import { JobRequestModal } from "@/components/job-request-modal"

// Default professional male profile image as fallback
const DEFAULT_PROFESSIONAL_IMAGE = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"

interface TechnicianCardProps {
  technician: Technician
  onOrderClick?: () => void
}

export function TechnicianCard({ technician, onOrderClick }: TechnicianCardProps) {
  const [imgSrc, setImgSrc] = useState(technician.image || DEFAULT_PROFESSIONAL_IMAGE)
  const [requestSent, setRequestSent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user } = useUser()

  // Update imgSrc if technician object changes
  useEffect(() => {
    setImgSrc(technician.image || DEFAULT_PROFESSIONAL_IMAGE)
  }, [technician.image])

  const handleOpenModal = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (onOrderClick) {
      onOrderClick()
    } else {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleRequestSuccess = () => {
    setRequestSent(true)
    setIsModalOpen(false)
  }

  return (
    <div className="block group h-full">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col">
        {/* Image Section - Link wrapper only for image */}
        <Link href={`/technician/${technician.id}`} className="relative h-48 overflow-hidden block">
          <img
            src={imgSrc}
            alt={technician.name}
            onError={() => setImgSrc(DEFAULT_PROFESSIONAL_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${technician.type === "digital" ? "bg-purple-500 text-white" : "bg-blue-500 text-white"
                }`}
            >
              {technician.type === "digital" ? "Digital Service" : "Onsite Service"}
            </div>
          </div>

          {/* Availability Badge */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${technician.available ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}
          >
            {technician.available ? "Available" : "Busy"}
          </div>

          {/* Rating */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-white text-sm font-medium">{technician.rating}</span>
            <span className="text-gray-300 text-xs">({technician.reviews})</span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link href={`/technician/${technician.id}`}>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {technician.name}
                </h3>
              </Link>
              <p className="text-primary font-medium">{technician.skill}</p>
            </div>
            {/* Price - ONLY illustrate for Digital */}
            {technician.type === "digital" && (
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">Rs. {technician.rate.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">per hour/project</div>
              </div>
            )}
          </div>

          {/* Areas / Remote Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            {technician.type === "digital" ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium text-green-600">Remote Service</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-primary" />
                <span className="truncate">{technician.areas.slice(0, 2).join(", ")}</span>
                {technician.areas.length > 2 && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">+{technician.areas.length - 2}</span>
                )}
              </>
            )}
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <span>{technician.experience} experience</span>
            <span className="text-xs">•</span>
            <span>{technician.completedJobs} jobs completed</span>
          </div>

          {/* Action Button - ONSITE ONLY */}
          {technician.type === "onsite" && (
            <div className="mt-auto pt-2">
              {requestSent ? (
                <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-lg text-sm font-medium text-center">
                  ✅ Your request has been sent. Please wait for approval.
                </div>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  Send Job Request
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Request Modal */}
      <JobRequestModal
        technician={technician}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleRequestSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        message="Please login or create an account to send a service request."
      />
    </div>
  )
}
