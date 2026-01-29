"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Palette, PenTool, Wrench, Lightbulb, Hammer, Search, Wind, Smartphone, Paintbrush } from "lucide-react"

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

const SERVICE_IMAGE_MAP: Record<string, string> = {
  "Web Design": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=85&auto=format",
  "Graphic Design": "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=600&fit=crop&q=85&auto=format",
  "Content Writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop&q=85&auto=format",
  "SEO Service": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop&q=85&auto=format",
  "Digital Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=85&auto=format", // Updated keyword mapping
  "Electrician": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&q=85&auto=format",
  "Plumber": "https://images.unsplash.com/photo-1581244276891-830992e5960e?w=800&h=600&fit=crop&q=85&auto=format",
  "AC Repair": "https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?w=800&h=600&fit=crop&q=85&auto=format",
  "Carpenter": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=600&fit=crop&q=85&auto=format",
  "Appliance Repair": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop&q=85&auto=format",
  "Painter": "https://images.unsplash.com/photo-1589939705384-5185138a04b9?w=800&h=600&fit=crop&q=85&auto=format",
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
    image: SERVICE_IMAGE_MAP["Web Design"],
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
    image: SERVICE_IMAGE_MAP["Graphic Design"],
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
    image: SERVICE_IMAGE_MAP["Content Writing"],
    serviceSlug: "content-writing",
  },
  {
    id: "seo-service",
    name: "SEO Service",
    icon: Search,
    type: "digital",
    description: "Top-rank your website on Google",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    image: SERVICE_IMAGE_MAP["SEO Service"],
    serviceSlug: "seo",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: Smartphone,
    type: "digital",
    description: "Social media and marketing strategy",
    color: "bg-blue-600",
    bgColor: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop&q=85&auto=format",
    serviceSlug: "digital-marketing",
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: Lightbulb,
    type: "onsite",
    description: "Licensed electrical work",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    image: SERVICE_IMAGE_MAP["Electrician"],
  },
  {
    id: "plumber",
    name: "Plumber",
    icon: Wrench,
    type: "onsite",
    description: "Professional plumbing services",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    image: SERVICE_IMAGE_MAP["Plumber"],
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    icon: Wind,
    type: "onsite",
    description: "AC installation and maintenance",
    color: "bg-cyan-500",
    bgColor: "bg-cyan-50",
    image: SERVICE_IMAGE_MAP["AC Repair"],
  },
  {
    id: "carpenter",
    name: "Carpenter",
    icon: Hammer,
    type: "onsite",
    description: "Expert carpentry and woodwork",
    color: "bg-amber-600",
    bgColor: "bg-amber-50",
    image: SERVICE_IMAGE_MAP["Carpenter"],
  },
  {
    id: "painter",
    name: "Painter",
    icon: Paintbrush,
    type: "onsite",
    description: "Wall painting and finishing",
    color: "bg-emerald-600",
    bgColor: "bg-emerald-50",
    image: SERVICE_IMAGE_MAP["Painter"],
  },
]

const FALLBACK_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop"

function CategoryCard({ category, badgeColor, onClick }: { category: Category, badgeColor: string, onClick: () => void }) {
  const [imgSrc, setImgSrc] = (typeof window !== "undefined") ?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require("react").useState(category.image) :
    [category.image, () => { }]

  const Icon = category.icon

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-green-500 flex flex-col h-full group border-border/50"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={`${category.name} service`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_SERVICE_IMAGE)}
          loading="lazy"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge on Image */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className={badgeColor} variant="secondary">
            {category.type === "digital" ? "Digital" : "Onsite"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${category.color} shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-foreground leading-tight">{category.name}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">{category.description}</p>

        <Button
          variant="ghost"
          className="w-full group/btn bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 rounded-xl font-semibold"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          Browse {category.name}s
          <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
        </Button>
      </div>
    </Card>
  )
}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const badgeColor = category.type === "digital" ? "bg-blue-100 text-blue-700" : "bg-cyan-100 text-cyan-700"

          return (
            <CategoryCard
              key={category.id}
              category={category}
              badgeColor={badgeColor}
              onClick={() => handleCategoryClick(category)}
            />
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
