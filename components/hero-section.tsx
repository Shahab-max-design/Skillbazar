"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronDown, Star, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { karachiAreas, services } from "@/lib/data"

export function HeroSection() {
  const router = useRouter()
  const [selectedArea, setSelectedArea] = useState("All Areas")
  const [selectedService, setSelectedService] = useState("All Services")
  const [areaOpen, setAreaOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedArea !== "All Areas") params.set("area", selectedArea)
    if (selectedService !== "All Services") params.set("service", selectedService)
    router.push(`/technicians?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center z-[1]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1920&h=1080&fit=crop"
          alt="Technician at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary-foreground">Serving Karachi, Pakistan</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up animation-delay-100">
            Find Trusted Professionals
            <span className="block text-primary">For Any Job — Instantly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200 max-w-2xl">
            From web developers and graphic designers to electricians and plumbers.
            Hire skilled professionals for both digital and onsite needs.
          </p>

          {/* Search Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 animate-fade-in-up animation-delay-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Area Dropdown */}
              <div className="relative z-[9999]">
                <label className="block text-sm text-gray-300 mb-2">Select Area</label>
                <button
                  onClick={() => {
                    setAreaOpen(!areaOpen)
                    setServiceOpen(false)
                  }}
                  className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 text-foreground hover:ring-2 hover:ring-primary transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedArea}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${areaOpen ? "rotate-180" : ""}`} />
                </button>
                {areaOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border max-h-60 overflow-y-auto z-[9999] animate-fade-in">
                    {karachiAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => {
                          setSelectedArea(area)
                          setAreaOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground first:rounded-t-xl last:rounded-b-xl"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Dropdown */}
              <div className="relative z-[9999]">
                <label className="block text-sm text-gray-300 mb-2">Select Service</label>
                <button
                  onClick={() => {
                    setServiceOpen(!serviceOpen)
                    setAreaOpen(false)
                  }}
                  className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 text-foreground hover:ring-2 hover:ring-primary transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" />
                    {selectedService}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${serviceOpen ? "rotate-180" : ""}`} />
                </button>
                {serviceOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border max-h-60 overflow-y-auto z-[9999] animate-fade-in">
                    {services.map((service) => (
                      <button
                        key={service}
                        onClick={() => {
                          setSelectedService(service)
                          setServiceOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-foreground first:rounded-t-xl last:rounded-b-xl"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg font-semibold animate-pulse-glow"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Professional
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-8 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">4.8+ Average Rating</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm">Same Day Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Card */}
      <div className="hidden lg:block absolute right-12 bottom-32 z-10 animate-float">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-1">5000+</div>
            <div className="text-sm text-gray-300">Happy Customers</div>
          </div>
          <div className="border-t border-white/20 my-4" />
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-1">150+</div>
            <div className="text-sm text-gray-300">Verified Pros</div>
          </div>
        </div>
      </div>
    </section>
  )
}
