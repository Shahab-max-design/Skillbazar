"use client"

import Link from "next/link"
import { Star, MapPin, Clock } from "lucide-react"
import type { Technician } from "@/lib/data"

interface TechnicianCardProps {
  technician: Technician
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  return (
    <Link href={`/technician/${technician.id}`} className="block group">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={technician.image || "/placeholder.svg"}
            alt={technician.name}
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
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {technician.name}
              </h3>
              <p className="text-primary font-medium">{technician.skill}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">Rs. {technician.rate.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{technician.type === "digital" ? "per hour/project" : "per visit"}</div>
            </div>
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{technician.experience} experience</span>
            <span className="text-xs">•</span>
            <span>{technician.completedJobs} jobs completed</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
