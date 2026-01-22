"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wrench, Home, Calendar, User, Settings, LogOut, LayoutDashboard, Users, CheckSquare } from "lucide-react"

interface SidebarLink {
  name: string
  href: string
  icon: React.ElementType
}

interface DashboardSidebarProps {
  type: "customer" | "technician" | "admin"
}

const customerLinks: SidebarLink[] = [
  { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
]

const technicianLinks: SidebarLink[] = [
  { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
]

const adminLinks: SidebarLink[] = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
]

export function DashboardSidebar({ type }: DashboardSidebarProps) {
  const pathname = usePathname()

  const links = type === "customer" ? customerLinks : type === "technician" ? technicianLinks : adminLinks

  const titles = {
    customer: "Customer Dashboard",
    technician: "Technician Dashboard",
    admin: "Admin Dashboard",
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-secondary border-r border-border hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-white">SkillBazaar</span>
        </Link>
      </div>

      {/* Dashboard Title */}
      <div className="px-6 py-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{titles[type]}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Links */}
      <div className="p-4 border-t border-border/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
