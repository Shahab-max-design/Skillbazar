"use client"

import { Button } from "@/components/ui/button"

interface ServiceTypeToggleProps {
  selected: "digital" | "onsite"
  onToggle: (type: "digital" | "onsite") => void
}

export function ServiceTypeToggle({ selected, onToggle }: ServiceTypeToggleProps) {
  return (
    <div className="flex gap-2 bg-muted rounded-lg p-1 w-fit">
      <Button
        onClick={() => onToggle("digital")}
        variant={selected === "digital" ? "default" : "ghost"}
        className={`px-6 py-2 rounded-md font-semibold transition-all ${
          selected === "digital"
            ? "bg-primary text-white shadow-md"
            : "hover:bg-muted-foreground/10"
        }`}
      >
        📱 Digital Services
      </Button>
      <Button
        onClick={() => onToggle("onsite")}
        variant={selected === "onsite" ? "default" : "ghost"}
        className={`px-6 py-2 rounded-md font-semibold transition-all ${
          selected === "onsite"
            ? "bg-primary text-white shadow-md"
            : "hover:bg-muted-foreground/10"
        }`}
      >
        📍 Onsite Services
      </Button>
    </div>
  )
}
