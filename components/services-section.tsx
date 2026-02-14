"use client"

import Link from "next/link"
import Image from "next/image"
import { Zap, Droplets, Wind, Hammer, Paintbrush, Wrench, Globe, Palette, Monitor, Search, PenTool, Video } from "lucide-react"

const onsiteServices = [
  {
    icon: Zap,
    name: "Electrician",
    description: "Wiring, installations, repairs & more",
    color: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: Droplets,
    name: "Plumber",
    description: "Pipe fitting, leak repairs, fixtures",
    color: "bg-blue-500",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNvVtblAruh4H14EDDM3k9Ci2G_506_iTbHA&s",
  },
  {
    icon: Wind,
    name: "AC Repair",
    description: "Installation, servicing & gas refill",
    color: "bg-cyan-500",
    image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWMlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    icon: Hammer,
    name: "Carpenter",
    description: "Furniture, cabinets & woodwork",
    color: "bg-amber-600",
    image: "https://images.unsplash.com/photo-1626081063434-79a2169791b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FycGVudGVyfGVufDB8fDB8fHww",
  },
  {
    icon: Paintbrush,
    name: "Painter",
    description: "Interior, exterior & textures",
    color: "bg-rose-500",
    image: "https://media.istockphoto.com/id/2223733276/photo/painter-painting-a-wall-with-a-paint-roller-in-green-and-turquoise.webp?a=1&b=1&s=612x612&w=0&k=20&c=5lW30kL34rz9vPDydRs5bHQymjhpYjEnmTVgffya4dA=",
  },
  {
    icon: Wrench,
    name: "Appliance Repair",
    description: "Washing machines, fridges & more",
    color: "bg-primary",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&h=600&fit=crop&q=85&auto=format",
  },
]

const digitalServices = [
  {
    icon: Globe,
    name: "Web Developer",
    description: "Websites, web apps & portals",
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: Palette,
    name: "Graphic Designer",
    description: "Logos, branding & marketing materials",
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: Monitor,
    name: "UI/UX Designer",
    description: "User interfaces & experience design",
    color: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: Search,
    name: "SEO Specialist",
    description: "Search engine optimization & rankings",
    color: "bg-green-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: PenTool,
    name: "Content Writer",
    description: "Blogs, copy & technical writing",
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop&q=85&auto=format",
  },
  {
    icon: Video,
    name: "Video Editor",
    description: "Editing, motion graphics & post-production",
    color: "bg-red-500",
    image: "https://images.unsplash.com/photo-1605826832916-d0ea9d6fe71e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpZGVvJTIwZWRpdGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
]

function ServiceCard({ service }: { service: any }) {
  // Determine service type based on service name
  const isOnsite = ['Electrician', 'Plumber', 'AC Repair', 'Carpenter', 'Painter', 'Appliance Repair'].includes(service.name)
  const serviceType = isOnsite ? 'onsite' : 'digital'

  // Create service slug - standardized identifier
  const createServiceSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  const serviceSlug = createServiceSlug(service.name)

  return (
    <Link
      href={`/services?type=${serviceType}&service=${serviceSlug}`}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={`${service.name} service`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          quality={85}
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
  )
}

export function ServicesSection() {
  return (
    <section className="py-20 bg-background overflow-hidden font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From technical repairs to digital solutions, we have the right professional for you.
          </p>
        </div>

        {/* Digital Services */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 flex-1 bg-border"></div>
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Globe className="w-6 h-6" />
              Digital Services
            </h3>
            <div className="h-0.5 flex-1 bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Onsite Services */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 flex-1 bg-border"></div>
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Wrench className="w-6 h-6" />
              Onsite Services
            </h3>
            <div className="h-0.5 flex-1 bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {onsiteServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
