"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import { Wrench, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { karachiAreas } from "@/lib/data"

const ONSITE_SERVICES = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Carpenter",
  "Painter",
  "Appliance Repair",
  "Locksmith",
  "Pest Control",
]

const DIGITAL_SKILLS = [
  "Web Development",
  "Graphic Design",
  "UI/UX Design",
  "SEO",
  "Content Writing",
  "Video Editing",
  "Digital Marketing",
  "Data Analysis",
]

type SignUpStep = "role" | "service-type" | "form" | "success"

export default function SignUpPage() {
  const router = useRouter()
  const { createUser } = useUser()
  const [step, setStep] = useState<SignUpStep>("role")
  const [selectedRole, setSelectedRole] = useState<"service-provider" | "customer" | null>(null)
  const [selectedServiceType, setSelectedServiceType] = useState<"onsite" | "digital" | null>(null)

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Service Provider - Onsite
    area: "",
    onsiteServices: [] as string[],
    // Service Provider - Digital
    digitalSkills: [] as string[],
    portfolioLink: "",
    hourlyRate: "",
    availability: "Full-time",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleRoleSelect = (role: "service-provider" | "customer") => {
    setSelectedRole(role)
    if (role === "customer") {
      // Customer goes directly to form
      setStep("form")
    } else {
      // Service Provider needs to choose service type
      setStep("service-type")
    }
  }

  const handleServiceTypeSelect = (type: "onsite" | "digital") => {
    setSelectedServiceType(type)
    setStep("form")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const toggleService = (service: string, type: "onsite" | "digital") => {
    if (type === "onsite") {
      setFormData((prev) => ({
        ...prev,
        onsiteServices: prev.onsiteServices.includes(service)
          ? prev.onsiteServices.filter((s) => s !== service)
          : [...prev.onsiteServices, service],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        digitalSkills: prev.digitalSkills.includes(service)
          ? prev.digitalSkills.filter((s) => s !== service)
          : [...prev.digitalSkills, service],
      }))
    }
    setErrors((prev) => ({ ...prev, services: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic validation
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    // Service Provider validation
    if (selectedRole === "service-provider") {
      if (selectedServiceType === "onsite") {
        if (!formData.area) newErrors.area = "Area is required"
        if (formData.onsiteServices.length === 0)
          newErrors.services = "Please select at least one service"
      } else if (selectedServiceType === "digital") {
        if (formData.digitalSkills.length === 0)
          newErrors.services = "Please select at least one skill"
        if (!formData.portfolioLink.trim()) newErrors.portfolioLink = "Portfolio link is required"
        if (!formData.hourlyRate) newErrors.hourlyRate = "Hourly rate is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Determine the role based on selection
    let finalRole: "digital_provider" | "technician" | "customer" | "service-provider" = selectedRole === "service-provider" ? "service-provider" : "customer";

    // Convert service-provider + serviceType to new role format
    if (selectedRole === "service-provider") {
      if (selectedServiceType === "digital") {
        finalRole = "digital_provider" as any;
      } else if (selectedServiceType === "onsite") {
        finalRole = "technician" as any;
      }
    }

    // Create user data
    const userData = {
      role: finalRole,
      serviceType: selectedServiceType as "onsite" | "digital" | undefined,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      area: selectedServiceType === "onsite" ? formData.area : undefined,
      onsiteServices: selectedServiceType === "onsite" ? formData.onsiteServices : undefined,
      digitalSkills: selectedServiceType === "digital" ? formData.digitalSkills : undefined,
      portfolioLink: selectedServiceType === "digital" ? formData.portfolioLink : undefined,
      hourlyRate: selectedServiceType === "digital" ? Number(formData.hourlyRate) : undefined,
      availability: selectedServiceType === "digital" ? formData.availability : undefined,
      credits: 10, // Default credits for service providers
    }

    // Create account (does NOT auto-login)
    createUser(userData)

    // Show success message
    setStep("success")

    // Redirect to signin after 2.5 seconds
    setTimeout(() => {
      router.push("/auth/signin")
    }, 2500)
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Join SkillBazaar</h1>
          <p className="text-muted-foreground">
            {step === "role" && "Choose how you want to get started"}
            {step === "service-type" && "What type of services do you provide?"}
            {step === "form" && "Complete your profile"}
            {step === "success" && "Account created successfully"}
          </p>
        </div>

        {/* STEP 1: Role Selection */}
        {step === "role" && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => handleRoleSelect("service-provider")}
              className="w-full p-6 border-2 border-border rounded-2xl hover:border-primary hover:bg-muted transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Service Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Offer your skills and earn money
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("customer")}
              className="w-full p-6 border-2 border-border rounded-2xl hover:border-primary hover:bg-muted transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Hire Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Find trusted professionals for your needs
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2: Service Type Selection (for Service Providers) */}
        {step === "service-type" && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => handleServiceTypeSelect("onsite")}
              className="w-full p-6 border-2 border-border rounded-2xl hover:border-primary hover:bg-muted transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Onsite Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Electrician, Plumber, AC Repair, etc.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleServiceTypeSelect("digital")}
              className="w-full p-6 border-2 border-border rounded-2xl hover:border-primary hover:bg-muted transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Digital Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Web Development, Design, SEO, etc.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <button
              onClick={() => setStep("role")}
              className="w-full flex items-center justify-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}

        {/* STEP 3: Sign-Up Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {/* Onsite Service Provider Form */}
            {selectedRole === "service-provider" && selectedServiceType === "onsite" && (
              <>
                {/* Area Selection */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm font-medium">
                    Service Area
                  </Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData((prev) => ({ ...prev, area: value }))}>
                    <SelectTrigger id="area" className="w-full rounded-xl border-border">
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent>
                      {karachiAreas.filter((a) => a !== "All Areas").map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>

                {/* Onsite Services Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Services You Offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ONSITE_SERVICES.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service, "onsite")}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-2 ${formData.onsiteServices.includes(service)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary"
                          }`}
                      >
                        {formData.onsiteServices.includes(service) && (
                          <Check className="w-4 h-4" />
                        )}
                        {service}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
                </div>
              </>
            )}

            {/* Digital Service Provider Form */}
            {selectedRole === "service-provider" && selectedServiceType === "digital" && (
              <>
                {/* Digital Skills Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Skills You Offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIGITAL_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleService(skill, "digital")}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-2 ${formData.digitalSkills.includes(skill)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary"
                          }`}
                      >
                        {formData.digitalSkills.includes(skill) && (
                          <Check className="w-4 h-4" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
                </div>

                {/* Portfolio Link */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioLink" className="text-sm font-medium">
                    Portfolio Link
                  </Label>
                  <Input
                    id="portfolioLink"
                    name="portfolioLink"
                    type="url"
                    placeholder="https://your-portfolio.com"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    className="rounded-xl border-border focus-visible:ring-primary"
                  />
                  {errors.portfolioLink && <p className="text-sm text-red-500">{errors.portfolioLink}</p>}
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-sm font-medium">
                    Hourly Rate (Rs.)
                  </Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    placeholder="1000"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="rounded-xl border-border focus-visible:ring-primary"
                  />
                  {errors.hourlyRate && <p className="text-sm text-red-500">{errors.hourlyRate}</p>}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-sm font-medium">
                    Availability
                  </Label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}>
                    <SelectTrigger id="availability" className="w-full rounded-xl border-border">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Common Form Fields */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

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
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={handleInputChange}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="rounded-xl border-border focus-visible:ring-primary"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 mt-6">
              Create Account
            </Button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                if (selectedRole === "service-provider" && selectedServiceType) {
                  setStep("service-type")
                } else {
                  setStep("role")
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </form>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Account Created Successfully!</h2>
              <p className="text-muted-foreground">
                Please log in to your account to get started.
              </p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
