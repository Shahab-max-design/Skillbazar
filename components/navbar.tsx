"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Wrench, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { redirectByRole } from "@/utils/roleRedirect"
import { initializeDemoUser, useUser } from "@/hooks/use-user"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    // Initialize demo user on first page load
    initializeDemoUser()

    // Check if user is authenticated
    const loggedIn = localStorage.getItem("skillbazaar_logged_in") === "true"
    setIsAuthenticated(loggedIn)

    // Also listen for storage changes (when login happens in another tab or same tab)
    const handleStorageChange = () => {
      const isNowLoggedIn = localStorage.getItem("skillbazaar_logged_in") === "true"
      setIsAuthenticated(isNowLoggedIn)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleProfileClick = () => {
    console.log("Profile icon clicked - redirecting by role");
    redirectByRole(router)
  }

  const handleLogout = () => {
    console.log("Signing out - clearing all auth state");
    localStorage.clear()
    setIsAuthenticated(false)
    setIsMenuOpen(false)
    router.push("/auth/signin")
  }

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
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center relative hover:bg-primary/20 transition-colors"
                  title="Go to Dashboard"
                >
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
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

            {isAuthenticated ? (
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center relative">
                    {user?.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{user?.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role?.replace("_", " ")}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleProfileClick()
                    setIsOpen(false)
                  }}
                  className="block w-full py-2 text-foreground text-left hover:text-primary transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full py-2 text-foreground text-left hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
