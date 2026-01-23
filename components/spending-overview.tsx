"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle } from "lucide-react"

export function SpendingOverview() {
  const totalSpending = 24500
  const pendingPayments = 5200
  const spentThisMonth = 4200

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-4">Spending Overview</h3>
        </div>

        {/* Total Spending */}
        <div className="border-b border-border pb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Spending</p>
              <p className="text-3xl font-bold text-foreground">PKR {totalSpending.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground">Lifetime spending on all services</p>
        </div>

        {/* This Month */}
        <div className="border-b border-border pb-4">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-2xl font-bold text-foreground mb-1">PKR {spentThisMonth.toLocaleString()}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">35% of average monthly spending</p>
        </div>

        {/* Pending Payments */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="text-xl font-bold text-orange-600">PKR {pendingPayments.toLocaleString()}</p>
          </div>
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        </div>
      </div>
    </Card>
  )
}
