"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Palette, PenTool, Wrench, Lightbulb, Hammer } from "lucide-react"

interface Category {
  id: string
  name: string
  icon: React.ElementType
  type: "digital" | "onsite"
  description: string
  color: string
  bgColor: string
  image: string
  serviceSlug?: string
}

const CATEGORIES: Category[] = [
  {
    id: "web-design",
    name: "Web Design",
    icon: Code2,
    type: "digital",
    description: "Professional website design services",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    serviceSlug: "web-development",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    icon: Palette,
    type: "digital",
    description: "Creative graphic design solutions",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    serviceSlug: "graphic-design",
  },
  {
    id: "content-writing",
    name: "Content Writing",
    icon: PenTool,
    type: "digital",
    description: "High-quality content creation",
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    image: "https://images.unsplash.com/photo-1455165814004-e71c99eed928?w=500&h=300&fit=crop",
    serviceSlug: "content-writing",
  },
  {
    id: "plumber",
    name: "Plumber",
    icon: Wrench,
    type: "onsite",
    description: "Professional plumbing services",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1584622281867-8d5c35b7db12?w=500&h=300&fit=crop",
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: Lightbulb,
    type: "onsite",
    description: "Licensed electrical work",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    icon: Hammer,
    type: "onsite",
    description: "Expert carpentry and woodwork",
    color: "bg-amber-600",
    bgColor: "bg-amber-50",
    image: "https://images.unsplash.com/photo-1565629888635-f08b4b0c6f0d?w=500&h=300&fit=crop",
  },
]

export function QuickCategories() {
  const router = useRouter()

  const handleCategoryClick = (category: Category) => {
    // Digital services route to /find-services with service slug
    if (category.type === "digital" && category.serviceSlug) {
      const query = new URLSearchParams({
        type: "digital",
        service: category.serviceSlug,
      })
      router.push(`/find-services?${query.toString()}`)
    } else {
      // Onsite services route to /technicians with skill
      const query = new URLSearchParams({
        skill: category.name,
        type: category.type,
      })
      router.push(`/technicians?${query.toString()}`)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Discover Services</h2>
        <p className="text-muted-foreground">
          Browse professionals across digital and onsite services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          const badgeColor = category.type === "digital" ? "bg-blue-100 text-blue-700" : "bg-cyan-100 text-cyan-700"

          return (
            <Card
              key={category.id}
              className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-green-500 flex flex-col h-full group"
              onClick={() => handleCategoryClick(category)}
            >
              {/* Image Section */}
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Badge on Image */}
                <div className="absolute top-3 right-3">
                  <Badge className={badgeColor} variant="secondary">
                    {category.type === "digital" ? "Digital" : "Onsite"}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{category.description}</p>

                <Button
                  variant="ghost"
                  className="w-full group/btn bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCategoryClick(category)
                  }}
                >
                  Browse {category.name}s
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Hybrid Services Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <h3 className="font-bold text-foreground mb-2">✨ SkillBazar Hybrid Services</h3>
        <p className="text-sm text-muted-foreground">
          Find skilled professionals for both <span className="font-semibold">digital services</span> (web design, writing, graphics) and{" "}
          <span className="font-semibold">onsite services</span> (plumbing, electrical, carpentry) - all in one place.
        </p>
      </div>
    </div>
  )
}
