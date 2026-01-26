"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscriptionPlans } from "@/lib/data"
import { Check, Star } from "lucide-react"

export default function SubscriptionPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectPlan = (planId: string) => {
    setIsProcessing(true)
    setSelectedPlan(planId)

    // Simulate processing
    setTimeout(() => {
      // Get plan details
      const plan = subscriptionPlans.find(p => p.id === planId)
      const creditAmount = plan?.credits === "unlimited" ? 99999 : (typeof plan?.credits === "number" ? plan.credits : 0)

      // Store subscription info in localStorage
      const subscriptionData = {
        technicianId: localStorage.getItem("technicianId") || "tech-" + Date.now(),
        plan: planId as "free" | "basic" | "standard" | "premium",
        credits: creditAmount,
        activationDate: new Date().toISOString(),
      }

      localStorage.setItem("technicianSubscription", JSON.stringify(subscriptionData))

      // Log transaction
      import("@/lib/credits").then(({ addTransaction }) => {
        addTransaction({
          amount: creditAmount,
          type: "purchase",
          reason: `Subscription Purchase (${planId} Plan)`
        })
      })

      // Dispatch event to update dashboard immediately
      window.dispatchEvent(new Event("credits-updated"))

      // Redirect to technician dashboard
      setIsProcessing(false)
      router.push("/dashboard/technician")
    }, 800)
  }

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a subscription plan to get started. You can upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 overflow-hidden cursor-pointer
                ${selectedPlan === plan.id
                  ? "ring-2 ring-green-500 shadow-lg scale-105"
                  : "hover:shadow-lg hover:scale-102"
                }
                ${plan.color}
              `}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2 text-white text-sm font-bold flex items-center justify-center gap-1">
                  <Star className="w-4 h-4" />
                  RECOMMENDED
                </div>
              )}

              <div className="p-6 flex flex-col flex-1" style={{ paddingTop: plan.recommended ? "3rem" : undefined }}>
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-foreground">
                    {typeof plan.price === "number" ? `Rs ${plan.price.toLocaleString()}` : plan.price}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.priceLabel}</p>
                </div>

                {/* Credits */}
                <div className="mb-6 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm font-semibold text-foreground">
                    {plan.credits === "unlimited"
                      ? "Unlimited Credits"
                      : `${plan.credits} Monthly Credits`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.credits === "unlimited"
                      ? "Accept unlimited service requests"
                      : "Service leads per month"
                    }
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${selectedPlan === plan.id
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : plan.recommended
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                >
                  {isProcessing && selectedPlan === plan.id
                    ? "Processing..."
                    : selectedPlan === plan.id
                      ? "Selected ✓"
                      : "Select Plan"
                  }
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-card rounded-lg border p-6 lg:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">How Subscription Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Service Credits</h3>
              <p className="text-sm text-muted-foreground">
                Each time you accept or respond to a customer request, one service credit is deducted.
                When credits reach zero, you'll need to upgrade to continue accepting requests.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Flexible Plans</h3>
              <p className="text-sm text-muted-foreground">
                Start with any plan and upgrade or downgrade anytime. There are no hidden charges.
                Billing is monthly and you can cancel anytime.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Higher-tier plans get better visibility in customer searches, helping you attract
                more qualified leads and bookings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Premium Support</h3>
              <p className="text-sm text-muted-foreground">
                Premium and Standard plans include priority support to help you succeed
                and grow your service business.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
