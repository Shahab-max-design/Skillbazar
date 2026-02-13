"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { JobRequestModal } from "@/components/job-request-modal"
import { technicians } from "@/lib/data"
import { useRecentProfessionals } from "@/hooks/use-recent-professionals"
import { useUser } from "@/hooks/use-user"
import { AuthModal } from "@/components/auth-modal"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Shield,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TechnicianProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { addProfessional } = useRecentProfessionals()
  const { user } = useUser()

  const technician = technicians.find((t) => t.id === resolvedParams.id)

  const handleBookingClick = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    setIsBookingOpen(true)
  }

  // Track when professional is viewed
  useEffect(() => {
    if (technician) {
      addProfessional({
        id: technician.id,
        name: technician.name,
        skill: technician.skill,
        image: technician.image,
        rating: technician.rating,
        reviews: technician.reviews,
        type: technician.type,
      })
    }
  }, [technician, addProfessional])

  if (!technician) {
    return (
      <main className="min-h-screen bg-muted">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-foreground mb-4">Technician not found</h1>
          <Link href="/technicians">
            <Button>Back to Technicians</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      {/* Banner Image */}
      <div className="relative h-64 sm:h-80 mt-16">
        <img
          src={`https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1920&h=400&fit=crop`}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />

        {/* Back Button */}
        <Link
          href="/technicians"
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={technician.image || "/placeholder.svg"}
                  alt={technician.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                />
                {technician.available && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{technician.name}</h1>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Verified
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${technician.type === "onsite" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                    {technician.type === "onsite" ? "Onsite Service" : "Digital Service"}
                  </span>
                </div>

                <p className="text-xl text-primary font-semibold mb-3">{technician.skill}</p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-bold text-foreground">{technician.rating}</span>
                    <span className="text-muted-foreground">({technician.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{technician.completedJobs} jobs completed</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{technician.experience} experience</span>
                  </div>
                </div>
              </div>

              {/* Price - ONSITE HIDDEN, DIGITAL VISIBLE */}
              {technician.type === "digital" && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">Rs. {technician.rate.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">per visit</div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">About</h2>
            <p className="text-muted-foreground leading-relaxed">{technician.bio}</p>
          </div>

          {/* Skills Tags */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {technician.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                >
                  <Award className="w-3 h-3 inline mr-1.5" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Areas Served */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Areas Served</h2>
            <div className="flex flex-wrap gap-2">
              {technician.areas.map((area, index) => (
                <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                  <MapPin className="w-3 h-3 inline mr-1.5" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 sm:p-8 bg-muted border-t border-border">
            {technician.type === "onsite" ? (
              // ONSITE ACTION: Send Job Request Only
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBookingClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Send Job Request
                </Button>
              </div>
            ) : (
              // DIGITAL ACTION: Book, Call, WhatsApp
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBookingClick}
                  className="flex-1 bg-primary hover:bg-primary/90 py-6 text-lg"
                >
                  Book Now
                </Button>
                <a href={`tel:${technician.phone}`} className="flex-1">
                  <Button variant="outline" className="w-full py-6 text-lg bg-transparent">
                    <Phone className="w-5 h-5 mr-2" />
                    Call
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${technician.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full py-6 text-lg text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section - Kept same */}
        <div className="bg-card rounded-2xl shadow-xl mt-6 p-6 sm:p-8 animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Reviews</h2>
          <div className="space-y-6">
            {[
              {
                name: "Ali Hassan",
                rating: 5,
                date: "2 days ago",
                text: "Excellent work! Fixed my electrical issue within an hour. Very professional.",
              },
              {
                name: "Fatima Zaidi",
                rating: 5,
                date: "1 week ago",
                text: "Highly recommended. Came on time, did quality work, and charged fairly.",
              },
              {
                name: "Usman Khan",
                rating: 4,
                date: "2 weeks ago",
                text: "Good service overall. Would hire again for future electrical work.",
              },
            ].map((review, index) => (
              <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Conditionally render Modal based on Type */}
      {technician.type === "onsite" ? (
        <JobRequestModal
          technician={technician}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      ) : (
        <BookingModal
          technician={technician}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        message="Please login or create an account to send a service request."
      />
    </main>
  )
}
