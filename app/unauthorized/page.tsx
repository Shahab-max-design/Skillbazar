"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this dashboard. Please log in with the correct account.
          </p>
        </div>

        <div className="space-y-3 mt-8">
          <Link href="/dashboard/customer" className="w-full block">
            <Button variant="outline" className="w-full rounded-xl">
              Go to Customer Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full block">
            <Button variant="ghost" className="w-full rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/auth/signin" className="w-full block">
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">
              Sign In with Different Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
