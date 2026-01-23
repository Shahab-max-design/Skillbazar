"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TechnicianCard } from "@/components/technician-card"
import { technicians } from "@/lib/data"
import { Filter, X, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Service slug to display name mapping for digital services
const DIGITAL_SERVICES_MAP: { [key: string]: string } = {
  'web-development': 'Web Developer',
  'graphic-design': 'Graphic Designer',
  'content-writing': 'Content Writer',
}

// Function to convert service slug to display name
const getServiceDisplayName = (slug: string): string => {
  return DIGITAL_SERVICES_MAP[slug] || slug
}

function FindServicesContent() {
  const searchParams = useSearchParams()

  const typeParam = searchParams.get("type") || "digital"
  const serviceParam = searchParams.get("service") || ""

  const [selectedService, setSelectedService] = useState(serviceParam ? getServiceDisplayName(serviceParam) : "")
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(serviceParam || "")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading for demo effect
    const timer = setTimeout(() => {
      let filtered = technicians

      // Filter by digital type
      filtered = filtered.filter((tech) => tech.type === "digital")

      // Service filter - use service field matching
      if (selectedServiceSlug) {
        filtered = filtered.filter((tech) => {
          return tech.service === selectedServiceSlug
        })

        // Debug logging for troubleshooting
        if (filtered.length === 0) {
          console.warn(
            `[Find Services Filter] No results found for service\nService Slug: ${selectedServiceSlug}\nTotal Digital Technicians: ${technicians.filter(t => t.type === 'digital').length}\nMatching Service Field: ${technicians
              .filter(t => t.type === 'digital')
              .map(t => `${t.name} (${t.skill}) -> service=${t.service}`)
              .join(', ')}`
          )
        }
      }

      setFilteredTechnicians(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedServiceSlug])

  const clearFilters = () => {
    setSelectedService("")
    setSelectedServiceSlug("")
  }

  const hasFilters = selectedServiceSlug !== ""

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb and back button */}
        <div className="mb-6 flex items-center gap-2">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {selectedService ? `${selectedService} Professionals` : "Browse Digital Services"}
          </h1>
          <p className="text-muted-foreground">
            {selectedServiceSlug 
              ? `Discover qualified ${selectedService.toLowerCase()} professionals ready to help you.`
              : "Select a service from our digital offerings."}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {filteredTechnicians.length} {filteredTechnicians.length === 1 ? "Professional" : "Professionals"} Found
              </span>
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTechnicians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <p className="text-lg font-semibold mb-2">No Professionals Found</p>
              <p className="text-sm">
                {selectedServiceSlug
                  ? `We couldn't find any ${selectedService.toLowerCase()} professionals. Try selecting a different service.`
                  : "Please select a service to see available professionals."}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default function FindServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FindServicesContent />
    </Suspense>
  )
}
