"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { TechnicianSlider } from "@/components/technician-slider"

export default function HomePage() {

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TechnicianSlider />
      <HowItWorks />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
