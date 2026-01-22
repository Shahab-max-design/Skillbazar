import Link from "next/link"
import { Wrench, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SkillBazaar</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting you with trusted technicians in Karachi. Fast, reliable, and affordable services.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/technicians?service=Electrician" className="hover:text-primary transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/technicians?service=Plumber" className="hover:text-primary transition-colors">
                  Plumbers
                </Link>
              </li>
              <li>
                <Link href="/technicians?service=AC Repair" className="hover:text-primary transition-colors">
                  AC Repair
                </Link>
              </li>
              <li>
                <Link href="/technicians?service=Carpenter" className="hover:text-primary transition-colors">
                  Carpenters
                </Link>
              </li>
              <li>
                <Link href="/technicians?service=Painter" className="hover:text-primary transition-colors">
                  Painters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Become a Technician
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 SkillBazaar. All rights reserved. Made in Karachi, Pakistan.</p>
        </div>
      </div>
    </footer>
  )
}
