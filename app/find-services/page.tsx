"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TechnicianCard } from "@/components/technician-card"
import { DigitalServiceCard } from "@/components/digital-service-card"
import { OrderServiceModal } from "@/components/order-service-modal"
import { technicians } from "@/lib/data"
import { Search, Filter, X, Loader2, ArrowLeft } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)

  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading for demo effect
    const timer = setTimeout(() => {
      let filtered = technicians

      // Filter by digital type if type param is digital or not specified (default)
      // If we want to support onsite too, we should check typeParam
      if (typeParam === 'digital') {
        filtered = filtered.filter((tech) => tech.type === "digital")
      } else {
        filtered = filtered.filter((tech) => tech.type === "onsite")
      }

      // Service filter - use service field matching
      if (selectedServiceSlug) {
        filtered = filtered.filter((tech) => {
          return tech.service === selectedServiceSlug
        })
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter((tech) =>
          tech.skill.toLowerCase().includes(query) ||
          tech.name.toLowerCase().includes(query)
        )
      }

      setFilteredTechnicians(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedServiceSlug, searchQuery, typeParam])

  const clearFilters = () => {
    setSelectedService("")
    setSelectedServiceSlug("")
    setSearchQuery("")
  }

  const handleOrderClick = (technician: any) => {
    setSelectedProvider(technician)
    setIsOrderModalOpen(true)
  }

  const hasFilters = selectedServiceSlug !== "" || searchQuery !== ""

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb and back button */}
        <div className="mb-6 flex items-center gap-2">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {selectedService ? `${selectedService} Professionals` : "Explore Digital Services"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {selectedServiceSlug
              ? `Connect with top-rated ${selectedService.toLowerCase()} experts for your project.`
              : "Find the perfect freelance professional for your next digital project."}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-border/50">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for services or professionals..."
                className="w-full bg-muted/30 hover:bg-muted/50 rounded-xl pl-12 pr-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none border border-transparent focus:border-primary/30 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap px-2">
                {filteredTechnicians.length} {filteredTechnicians.length === 1 ? 'Professional' : 'Professionals'} Found
              </span>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Finding the best professionals...</p>
          </div>
        ) : filteredTechnicians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTechnicians.map((technician, index) => (
              <div key={technician.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {typeParam === 'digital' ? (
                  <div className="h-full">
                    <DigitalServiceCard
                      id={technician.id}
                      providerName={technician.name}
                      providerAvatar={technician.image}
                      serviceTitle={technician.skill}
                      description={`${technician.name} is a professional ${technician.skill} with ${technician.experience} of experience. delivering high quality work.`}
                      startingPrice={technician.rate}
                      deliveryTime="3-5 Days"
                      rating={technician.rating}
                      reviews={technician.reviews}
                      onOrderClick={() => handleOrderClick(technician)}
                      image={technician.coverImage}
                    />
                  </div>
                ) : (
                  <div className="h-full">
                    <TechnicianCard technician={technician} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">No professionals found</h3>
              <p className="text-muted-foreground">
                We couldn't find any professionals matching your criteria. Try adjusting your search or filters.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-2">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {selectedProvider && (
        <OrderServiceModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          serviceTitle={selectedProvider.skill}
          providerName={selectedProvider.name}
          startingPrice={selectedProvider.rate}
          providerId={selectedProvider.id}
          providerImage={selectedProvider.image}
        />
      )}
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
