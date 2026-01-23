"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"

interface SearchBarProps {
  onSearch?: (query: string) => void
  onLocationChange?: (location: string) => void
}

export function SearchBar({ onSearch, onLocationChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    onLocationChange?.(value)
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="What service are you looking for today? (e.g., Plumber, Web Designer)"
          className="pl-12 pr-4 py-3 text-base rounded-lg border-2 border-muted focus:border-primary transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Location Picker & Search Button */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Select area (for Onsite services)"
            className="pl-12 pr-4 py-2 text-sm rounded-lg border border-muted focus:border-primary transition-colors"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSearch}
          className="px-6 rounded-lg font-semibold"
        >
          Search
        </Button>
      </div>
    </div>
  )
}
