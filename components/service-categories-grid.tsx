"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ServiceCategory {
  id: string
  name: string
  icon: string
  type: "digital" | "onsite"
  description: string
  count: number
}

interface ServiceCategoryCardProps {
  category: ServiceCategory
  onClick?: () => void
}

function ServiceCategoryCard({ category, onClick }: ServiceCategoryCardProps) {
  return (
    <Card
      onClick={onClick}
      className="p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300 group"
    >
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>

        {/* Category Name */}
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        </div>

        {/* Type Badge */}
        <Badge variant="outline" className="mx-auto">
          {category.type === "digital" ? "📱 Digital" : "📍 Onsite"}
        </Badge>

        {/* Count */}
        <div className="text-xs text-muted-foreground">
          {category.count} professionals available
        </div>
      </div>
    </Card>
  )
}

interface ServiceCategoriesGridProps {
  categories: ServiceCategory[]
  onCategoryClick?: (category: ServiceCategory) => void
}

export function ServiceCategoriesGrid({ categories, onCategoryClick }: ServiceCategoriesGridProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Browse Services</h2>
        <p className="text-muted-foreground">Click on any service to view available professionals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <ServiceCategoryCard
            key={category.id}
            category={category}
            onClick={() => onCategoryClick?.(category)}
          />
        ))}
      </div>
    </div>
  )
}
