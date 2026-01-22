"use client"

import Link from "next/link"
import { Zap, Droplets, Wind, Hammer, Paintbrush, Wrench } from "lucide-react"

const servicesList = [
  {
    icon: Zap,
    name: "Electrician",
    description: "Wiring, installations, repairs & more",
    color: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  },
  {
    icon: Droplets,
    name: "Plumber",
    description: "Pipe fitting, leak repairs, fixtures",
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    icon: Wind,
    name: "AC Repair",
    description: "Installation, servicing & gas refill",
    color: "bg-cyan-500",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
  },
  {
    icon: Hammer,
    name: "Carpenter",
    description: "Furniture, cabinets & woodwork",
    color: "bg-amber-600",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
  },
  {
    icon: Paintbrush,
    name: "Painter",
    description: "Interior, exterior & textures",
    color: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
  },
  {
    icon: Wrench,
    name: "Appliance Repair",
    description: "Washing machines, fridges & more",
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=300&fit=crop",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From electrical work to home repairs, we have skilled professionals for all your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <Link
              key={index}
              href={`/technicians?service=${service.name}`}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center`}>
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                </div>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
