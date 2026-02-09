"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TechnicianCard } from "@/components/technician-card"
import { DigitalServiceCard } from "@/components/digital-service-card"
import { OrderServiceModal } from "@/components/order-service-modal"
import { technicians, karachiAreas, services } from "@/lib/data"
import { Search, MapPin, Filter, ChevronDown, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function TechniciansContent() {
  const searchParams = useSearchParams()

  // Support both old and new parameter names
  const skillParam = searchParams.get("skill") || ""
  const typeParam = searchParams.get("type") || ""

  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "All Areas")
  const [selectedService, setSelectedService] = useState(skillParam || searchParams.get("service") || "All Services")
  const [selectedServiceType, setSelectedServiceType] = useState<"onsite" | "digital" | "all">(
    (typeParam as any) || (searchParams.get("serviceType") as any) || "all"
  )
  const [areaOpen, setAreaOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)

  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading for demo effect
    const timer = setTimeout(() => {
      let filtered = technicians

      // Filter by service type (onsite vs digital)
      if (selectedServiceType === "onsite") {
        filtered = filtered.filter((tech) => tech.type === "onsite")
      } else if (selectedServiceType === "digital") {
        filtered = filtered.filter((tech) => tech.type === "digital")
      }

      // Area filter only applies to onsite services
      if (selectedServiceType !== "digital" && selectedArea !== "All Areas") {
        filtered = filtered.filter((tech) => tech.areas.includes(selectedArea))
      }

      // Service filter
      if (selectedService !== "All Services") {
        filtered = filtered.filter((tech) => tech.skill === selectedService)
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter((tech) =>
          tech.skill.toLowerCase().includes(query) ||
          tech.name.toLowerCase().includes(query) ||
          tech.skills.some(s => s.toLowerCase().includes(query))
        )
      }

      setFilteredTechnicians(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedArea, selectedService, selectedServiceType, searchQuery])

  const clearFilters = () => {
    setSelectedArea("All Areas")
    setSelectedService("All Services")
    setSelectedServiceType("all")
    setSearchQuery("")
  }

  const handleOrderClick = (technician: any) => {
    setSelectedProvider(technician)
    setIsOrderModalOpen(true)
  }

  const hasFilters = selectedArea !== "All Areas" || selectedService !== "All Services" || selectedServiceType !== "all" || searchQuery !== ""

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      {/* Header */}
      <div className="bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Find Services
          </h1>
          <p className="text-gray-400">Browse verified professionals for digital and onsite needs</p>
        </div>
      </div>

      {/* Service Type Tabs */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrolbar-hide">
            <button
              onClick={() => setSelectedServiceType("all")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedServiceType === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              All Services
            </button>
            <button
              onClick={() => setSelectedServiceType("digital")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedServiceType === "digital"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              Digital Services
            </button>
            <button
              onClick={() => setSelectedServiceType("onsite")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedServiceType === "onsite"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              Onsite Services
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background sticky top-16 z-30 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Field */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="text"
                placeholder="Search for services (e.g. Electrician, Plumber...)"
                className="w-full bg-muted hover:bg-muted/80 rounded-xl pl-11 pr-4 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-primary/20 outline-none border border-transparent focus:border-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Area Filter - Only show for onsite services or when viewing all (optional, but requested logic says hide for digital) */}
            {selectedServiceType !== "digital" && (
              <div className="relative">
                <button
                  onClick={() => {
                    setAreaOpen(!areaOpen)
                    setServiceOpen(false)
                  }}
                  className="flex items-center gap-2 bg-muted hover:bg-muted/80 rounded-xl px-4 py-2.5 text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedArea}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${areaOpen ? "rotate-180" : ""}`} />
                </button>
                {areaOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-card rounded-xl shadow-xl border border-border max-h-60 overflow-y-auto z-20 min-w-48 animate-fade-in">
                    {karachiAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => {
                          setSelectedArea(area)
                          setAreaOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm first:rounded-t-xl last:rounded-b-xl ${selectedArea === area ? "bg-primary/10 text-primary" : "text-foreground"
                          }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Service Filter */}
            <div className="relative">
              {(() => {
                // Get services based on selected service type
                // Get services based on selected service type
                const digitalServices = ["All Services", "Web Developer", "Graphic Designer", "UI/UX Designer", "SEO Specialist", "Content Writer", "Video Editor", "Digital Marketing", "Data Analyst"]

                let displayServices = services
                if (selectedServiceType === "digital") {
                  displayServices = digitalServices
                } else if (selectedServiceType === "all") {
                  const onsiteOnly = services.filter(s => s !== "All Services")
                  const digitalOnly = digitalServices.filter(s => s !== "All Services")
                  displayServices = ["All Services", ...onsiteOnly, ...digitalOnly]
                }

                return (
                  <>
                    <button
                      onClick={() => {
                        setServiceOpen(!serviceOpen)
                        setAreaOpen(false)
                      }}
                      className="flex items-center gap-2 bg-muted hover:bg-muted/80 rounded-xl px-4 py-2.5 text-foreground transition-colors"
                    >
                      <Filter className="w-4 h-4 text-primary" />
                      <span className="text-sm">{selectedService}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${serviceOpen ? "rotate-180" : ""}`} />
                    </button>
                    {serviceOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-card rounded-xl shadow-xl border border-border max-h-60 overflow-y-auto z-20 min-w-48 animate-fade-in">
                        {displayServices.map((service) => (
                          <button
                            key={service}
                            onClick={() => {
                              setSelectedService(service)
                              setServiceOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm first:rounded-t-xl last:rounded-b-xl ${selectedService === service ? "bg-primary/10 text-primary" : "text-foreground"
                              }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm font-medium text-muted-foreground">
              {(() => {
                const count = filteredTechnicians.length
                let searchTerm = searchQuery.trim()

                if (!searchTerm && selectedService !== "All Services") {
                  searchTerm = selectedService
                }

                if (!searchTerm) {
                  return `${count} technician${count !== 1 ? "s" : ""} found`
                }

                // Enhanced pluralization logic
                const getDisplayLabel = (term: string, c: number) => {
                  const t = term.toLowerCase();
                  if (c === 1) return t;

                  // Pluralization rules
                  if (t.endsWith('ian')) return t + 's';
                  if (t.endsWith('er')) return t + 's';
                  if (t.endsWith('ist')) return t + 's';
                  if (t.endsWith('y')) return t.slice(0, -1) + 'ies';
                  if (t.endsWith('sh') || t.endsWith('ch') || t.endsWith('x')) return t + 'es';
                  if (t.endsWith('s')) return t;
                  return t + 's';
                }

                return (
                  <span className="animate-fade-in">
                    {count} <span className="text-primary">{getDisplayLabel(searchTerm, count)}</span> found
                  </span>
                )
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Technician Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Finding technicians...</p>
          </div>
        ) : filteredTechnicians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTechnicians.map((technician, index) => (
              <div key={technician.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {technician.type === 'digital' ? (
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
                  <TechnicianCard technician={technician} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No technicians found</h3>
            <p className="text-muted-foreground mb-4">Try changing your filters or search in a different area.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
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

export default function TechniciansPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-muted">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </main>
      }
    >
      <TechniciansContent />
    </Suspense>
  )
}
