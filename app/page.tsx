"use client"

import { Navbar } from "@/components/navbar"
import { ProfessionalHero } from "@/components/professional-hero"
import { HowItWorks } from "@/components/how-it-works"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { StatsSection } from "@/components/stats-section"
import { FindServicesSlider } from "@/components/find-services-slider"

export default function HomePage() {

  return (
    <main className="relative min-h-screen overflow-visible">
      <Navbar />
      <ProfessionalHero />
      <StatsSection />
      <FindServicesSlider />
      <HowItWorks />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
