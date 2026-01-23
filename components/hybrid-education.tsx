"use client"

import { Card } from "@/components/ui/card"

export function HybridEducation() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 mb-8 border-l-4 border-primary">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="text-2xl">🌐</span> One Platform. Two Ways to Work.
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            SkillBazar is a hybrid service marketplace that connects you with professionals both online and on-location
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Digital Services */}
          <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📱</span> Digital Services
            </h4>
            <p className="text-sm text-muted-foreground">
              Hire freelancers for remote work. Web development, design, writing, tutoring, and more from anywhere.
            </p>
          </div>

          {/* Onsite Services */}
          <div className="bg-white/80 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📍</span> Onsite Services
            </h4>
            <p className="text-sm text-muted-foreground">
              Book professionals in your area for hands-on work. Plumbing, electrical, carpentry, repairs, and more.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
