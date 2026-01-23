"use client"

import { Card } from "@/components/ui/card"

interface CategoryGridProps {
  serviceType: "digital" | "onsite"
  onCategorySelect?: (category: string) => void
}

export function CategoryGrid({ serviceType, onCategorySelect }: CategoryGridProps) {
  const digitalCategories = [
    { icon: "🎨", name: "Graphic Design", description: "Logo, UI/UX" },
    { icon: "✍️", name: "Content Writing", description: "Articles, blogs" },
    { icon: "💻", name: "Web Development", description: "Websites, apps" },
    { icon: "🎓", name: "Tutoring", description: "Online coaching" },
    { icon: "📸", name: "Photo Editing", description: "Enhancement" },
    { icon: "🎬", name: "Video Editing", description: "Montage, effects" },
    { icon: "📱", name: "Mobile Apps", description: "iOS & Android" },
    { icon: "📊", name: "Data Analytics", description: "Reports & insights" },
  ]

  const onsiteCategories = [
    { icon: "⚡", name: "Electrician", description: "Wiring, repairs" },
    { icon: "🚰", name: "Plumber", description: "Pipes, fixtures" },
    { icon: "🔧", name: "AC Repair", description: "Cooling systems" },
    { icon: "🪛", name: "Carpenter", description: "Furniture, frames" },
    { icon: "🎨", name: "Painter", description: "House painting" },
    { icon: "🧼", name: "Cleaning", description: "Home cleaning" },
    { icon: "🔌", name: "Appliance Repair", description: "Fridge, microwave" },
    { icon: "🏠", name: "General Maintenance", description: "Home upkeep" },
  ]

  const categories = serviceType === "digital" ? digitalCategories : onsiteCategories

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Popular {serviceType === "digital" ? "Digital" : "Onsite"} Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <Card
              key={category.name}
              onClick={() => onCategorySelect?.(category.name)}
              className="p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
