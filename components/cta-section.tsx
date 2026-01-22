import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* For Customers */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Find trusted technicians in your area and get your problems solved today.
            </p>
            <Link href="/technicians">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Find a Technician
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* For Technicians */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center md:text-left">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
              <Briefcase className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-3">Are You a Skilled Technician?</h3>
            <p className="text-primary-foreground/80 mb-6">
              Join our network of professionals and connect with customers looking for your services.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-primary-foreground hover:bg-white/20 bg-transparent"
            >
              Join as Technician
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
