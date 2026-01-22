"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillBazaar</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/technicians?serviceType=onsite" className="text-muted-foreground hover:text-foreground transition-colors">
              Find Technicians
            </Link>
            <Link href="/technicians?serviceType=digital" className="text-muted-foreground hover:text-foreground transition-colors">
              Find Digital Services
            </Link>
            <Link href="/dashboard/customer" className="text-muted-foreground hover:text-foreground transition-colors">
              Customer
            </Link>
            <Link
              href="/dashboard/technician"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Technician
            </Link>
            <Link href="/dashboard/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/technicians?serviceType=onsite" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Find Technicians
            </Link>
            <Link href="/technicians?serviceType=digital" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Find Digital Services
            </Link>
            <Link href="/dashboard/customer" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Customer Dashboard
            </Link>
            <Link href="/dashboard/technician" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Technician Dashboard
            </Link>
            <Link href="/dashboard/admin" className="block py-2 text-foreground" onClick={() => setIsOpen(false)}>
              Admin Dashboard
            </Link>
            <div className="flex gap-3 pt-3">
              <Link href="/auth/signin" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button className="w-full bg-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
