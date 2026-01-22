"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TechnicianCard } from "@/components/technician-card"
import { technicians, karachiAreas, services } from "@/lib/data"
import { Search, MapPin, Filter, ChevronDown, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function TechniciansContent() {
  const searchParams = useSearchParams()
  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "All Areas")
  const [selectedService, setSelectedService] = useState(searchParams.get("service") || "All Services")
  const [selectedServiceType, setSelectedServiceType] = useState<"onsite" | "digital" | "all">(
    (searchParams.get("serviceType") as any) || "all"
  )
  const [areaOpen, setAreaOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading for demo effect
    const timer = setTimeout(() => {
      let filtered = technicians

      // Digital services list
      const digitalServices = ["Web Developer", "Graphic Designer", "UI/UX Designer", "SEO Specialist", "Content Writer", "Video Editor", "Digital Marketing", "Data Analyst"]

      // Filter by service type (onsite vs digital)
      if (selectedServiceType === "onsite") {
        // Show only onsite technicians (not digital)
        filtered = filtered.filter((tech) => tech.skill && !digitalServices.includes(tech.skill))
      } else if (selectedServiceType === "digital") {
        // Show only digital service providers
        filtered = filtered.filter((tech) => digitalServices.includes(tech.skill || ""))
      }

      // Area filter only applies to onsite services
      if (selectedServiceType !== "digital" && selectedArea !== "All Areas") {
        filtered = filtered.filter((tech) => tech.areas.includes(selectedArea))
      }

      // Service filter
      if (selectedService !== "All Services") {
        filtered = filtered.filter((tech) => tech.skill === selectedService)
      }

      setFilteredTechnicians(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedArea, selectedService, selectedServiceType])

  const clearFilters = () => {
    setSelectedArea("All Areas")
    setSelectedService("All Services")
  }

  const hasFilters = selectedArea !== "All Areas" || selectedService !== "All Services"

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      {/* Header */}
      <div className="bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {selectedServiceType === "digital" ? "Find Digital Service Providers" : "Find Technicians"}
          </h1>
          <p className="text-gray-400">Browse verified professionals in Karachi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background sticky top-16 z-30 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Area Filter - Only show for onsite services */}
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
                      className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm first:rounded-t-xl last:rounded-b-xl ${
                        selectedArea === area ? "bg-primary/10 text-primary" : "text-foreground"
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
                const digitalServices = ["All Services", "Web Developer", "Graphic Designer", "UI/UX Designer", "SEO Specialist", "Content Writer", "Video Editor", "Digital Marketing", "Data Analyst"]
                const displayServices = selectedServiceType === "digital" ? digitalServices : services
                
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
                            className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm first:rounded-t-xl last:rounded-b-xl ${
                              selectedService === service ? "bg-primary/10 text-primary" : "text-foreground"
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
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? "s" : ""} found
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician, index) => (
              <div key={technician.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <TechnicianCard technician={technician} />
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
