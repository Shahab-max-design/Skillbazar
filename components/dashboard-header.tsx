"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Bell, User, Wrench } from "lucide-react"
import { useSidebar } from "./sidebar-context"

interface DashboardHeaderProps {
  title: string
  userName: string
  userRole: string
  profilePicture?: string
}

export function DashboardHeader({ title, userName, userRole, profilePicture }: DashboardHeaderProps) {
  const { toggleMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile Menu Toggle - Connected to Sidebar */}
        <button
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          onClick={toggleMobile}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-primary-foreground" />
          </div>
        </Link>

        {/* Page Title */}
        <h1 className="hidden lg:block text-xl font-semibold text-foreground">{title}</h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center relative">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-foreground">{userName}</div>
              <div className="text-xs text-muted-foreground">{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
