"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/use-user"
import { Wrench, ArrowLeft } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { loginUser } = useUser()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Attempt login
      const success = loginUser(formData.email, formData.password)
      console.log("Login attempt:", { email: formData.email, success });

      if (success) {
        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("skillbazaar_user") || "{}")
        console.log("User logged in:", user);
        
        // Determine the correct role based on user data
        let userRole: "digital_provider" | "technician" | "customer" | null = null;
        
        // Handle both new and legacy role formats
        if (user.role === "digital_provider" || (user.role === "service-provider" && user.serviceType === "digital")) {
          userRole = "digital_provider";
        } else if (user.role === "onsite_technician" || user.role === "technician" || (user.role === "service-provider" && user.serviceType === "onsite")) {
          userRole = "technician";
        } else if (user.role === "customer") {
          userRole = "customer";
        }
        
        console.log("Extracted role:", userRole);
        
        // Save the role using standardized key
        if (userRole) {
          localStorage.setItem("userRole", userRole);
          console.log("Role saved to userRole:", userRole);
        }
        
        // Success - redirect to dashboard entry point
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        console.log("Login failed - invalid credentials");
        setErrors({ email: "Invalid email or password" })
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillBazaar</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Welcome back! Sign in to your account
          </p>
        </div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="rounded-xl border-border focus-visible:ring-primary"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="rounded-xl border-border focus-visible:ring-primary"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Demo Credentials for Testing:
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Email: test@example.com | Password: test123
          </p>
        </div>
      </div>
    </div>
  )
}
