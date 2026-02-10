"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Wrench, Home, LogOut, LayoutDashboard, Users, CheckSquare, MessageSquare, Wallet, User, Calendar, MapPin, CreditCard, Briefcase, X } from "lucide-react"
import { useSidebar } from "./sidebar-context"
import { useToast } from "@/hooks/use-toast"

interface SidebarLink {
  name: string
  href: string
  icon: React.ElementType
}

interface DashboardSidebarProps {
  type: "customer" | "technician" | "digital" | "admin"
}

// Updated menu items per user requirements
const customerLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
  { name: "Browse Services", href: "/technicians", icon: Users },
  { name: "My Requests", href: "/dashboard/customer/bookings", icon: Calendar },
  { name: "Messages", href: "/dashboard/customer/messages", icon: MessageSquare },
  { name: "Wallet / Payments", href: "/dashboard/customer/wallet", icon: Wallet },
  { name: "Profile", href: "/dashboard/customer/profile", icon: User },
]

const technicianLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard/technician", icon: LayoutDashboard },
  { name: "My Services", href: "/dashboard/technician/services", icon: Briefcase },
  { name: "Job Requests", href: "/dashboard/technician/requests", icon: Calendar },
  { name: "Active Jobs", href: "/dashboard/technician/jobs", icon: CheckSquare },
  { name: "Messages", href: "/dashboard/technician/messages", icon: MessageSquare },
  { name: "Earnings", href: "/dashboard/technician/earnings", icon: Wallet },
  { name: "Area / Location", href: "/dashboard/technician/availability", icon: MapPin },
  { name: "Profile", href: "/dashboard/technician/profile", icon: User },
  { name: "Subscription / Credits", href: "/dashboard/technician/subscription", icon: CreditCard },
]

const digitalLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard/digital", icon: LayoutDashboard },
  { name: "Gig Management", href: "/dashboard/digital/gigs", icon: Briefcase },
  { name: "Orders", href: "/dashboard/digital/orders", icon: Calendar },
  { name: "Messages", href: "/dashboard/digital/messages", icon: MessageSquare },
  { name: "Earnings", href: "/dashboard/digital/earnings", icon: Wallet },
  { name: "Portfolio", href: "/dashboard/digital/profile", icon: User },
  { name: "Profile", href: "/dashboard/digital/profile", icon: User },
  { name: "Subscription / Credits", href: "/dashboard/technician/subscription", icon: CreditCard },
]

const adminLinks: SidebarLink[] = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
]

export function DashboardSidebar({ type }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobileOpen, setIsMobileOpen } = useSidebar()
  const { toast } = useToast()

  const handleSignOut = () => {
    localStorage.clear()
    toast({
      title: "Signed Out",
      description: "You have successfully signed out.",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-900"
    })
    router.push("/auth/signin")
  }

  const links = type === "customer" ? customerLinks : type === "technician" ? technicianLinks : type === "digital" ? digitalLinks : adminLinks

  const titles = {
    customer: "Customer Dashboard",
    technician: "Technician Dashboard",
    digital: "Digital Services Dashboard",
    admin: "Admin Dashboard",
  }

  // Close sidebar on navigation (mobile only)
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false)
    }
  }

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileOpen, setIsMobileOpen])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  const SidebarContent = () => (
    <>
      {/* Logo with Close Button (Mobile) */}
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-white">SkillBazaar</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dashboard Title */}
      <div className="px-6 py-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{titles[type]}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors overflow-hidden ${isActive ? "bg-primary text-primary-foreground" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Links */}
      <div className="p-4 border-t border-border/50 space-y-1">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <button
          onClick={() => {
            handleSignOut()
            handleLinkClick()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-border flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-border flex-col z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Navigation sidebar"
      >
        <SidebarContent />
      </aside>
    </>
  )
}
