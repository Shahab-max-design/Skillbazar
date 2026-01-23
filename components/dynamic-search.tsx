"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { karachiAreas } from "@/lib/data"

interface DynamicSearchProps {
  onSearch?: (query: string, serviceType: "digital" | "onsite", area?: string) => void
  onCategorySelect?: (category: string, serviceType: "digital" | "onsite", area?: string) => void
}

export function DynamicSearch({ onSearch, onCategorySelect }: DynamicSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [serviceType, setServiceType] = useState<"digital" | "onsite">("digital")
  const [selectedArea, setSelectedArea] = useState("")
  const [showAreaDropdown, setShowAreaDropdown] = useState(false)

  // Common onsite service keywords that trigger area selection
  const onsiteServices = [
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "ac repair",
    "appliance repair",
    "cleaning",
    "general maintenance",
  ]

  // Check if search query contains onsite service keywords
  const isOnsiteService = onsiteServices.some((service) => searchQuery.toLowerCase().includes(service))

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const detectedType = isOnsiteService ? "onsite" : "digital"
      onSearch?.(searchQuery, detectedType, selectedArea)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search services (e.g., 'Electrician', 'Web Developer')"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              const detected = onsiteServices.some((service) => e.target.value.toLowerCase().includes(service))
              setShowAreaDropdown(detected)
            }}
            onKeyPress={handleKeyPress}
            className="pl-12 pr-4 py-3 text-base rounded-lg border-2 border-muted focus:border-primary transition-colors"
          />
        </div>
        <Button onClick={handleSearch} className="px-6 py-3 rounded-lg font-semibold gap-2">
          <Search className="w-5 h-5" />
          Find Services
        </Button>
      </div>

      {/* Area Dropdown (Conditional for Onsite) */}
      {showAreaDropdown && (
        <div className="flex gap-2 items-end">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="flex-1 border-2 border-primary/30 rounded-lg">
              <SelectValue placeholder="Select Area (for Onsite Services)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Areas</SelectItem>
              {karachiAreas
                .filter((area) => area !== "All Areas")
                .map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground pb-3">Required for onsite services</span>
        </div>
      )}

      {/* Helpful Hint */}
      <div className="text-xs text-muted-foreground">
        💡 Tip: Type "Electrician" or "Plumber" to see area options for onsite services
      </div>
    </div>
  )
}
