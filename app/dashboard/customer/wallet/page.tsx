"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp } from "lucide-react"

export default function WalletPage() {
  const { user } = useUser()

  const transactions = [
    {
      id: "INV-001",
      date: "2024-01-15",
      description: "Electrical Repair - Ahmad Khan",
      amount: 3500,
      status: "paid",
      type: "service",
    },
    {
      id: "INV-002",
      date: "2024-01-10",
      description: "Web Development - Tech Solutions",
      amount: 15000,
      status: "paid",
      type: "service",
    },
    {
      id: "INV-003",
      date: "2024-01-08",
      description: "Plumbing Services - Hassan Malik",
      amount: 2500,
      status: "pending",
      type: "service",
    },
    {
      id: "INV-004",
      date: "2024-01-05",
      description: "House Painting - Professional Painters",
      amount: 8000,
      status: "paid",
      type: "service",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Wallet & Invoices" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Wallet & Invoices</h1>
              <p className="text-muted-foreground">Manage your payments, invoices, and transaction history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Wallet Balance Card */}
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-lg">
                <p className="text-sm font-medium opacity-90 mb-2">Wallet Balance</p>
                <h2 className="text-3xl font-bold mb-1">PKR 5,200</h2>
                <p className="text-sm opacity-75">Available for booking services</p>
              </Card>

              {/* Total Spent Card */}
              <Card className="p-6 border-primary/10 bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-1">PKR 29,000</h2>
                <p className="text-sm text-muted-foreground">Lifetime spending</p>
              </Card>

              {/* This Month Card */}
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">This Month</p>
                <h2 className="text-3xl font-bold text-foreground mb-1">PKR 4,200</h2>
                <p className="text-sm text-muted-foreground">29 days remaining</p>
              </Card>
            </div>

            {/* Transaction History */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">Transaction History</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{transaction.description}</p>
                        <Badge
                          className={
                            transaction.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {transaction.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="font-bold text-foreground">PKR {transaction.amount.toLocaleString()}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-1 h-7 text-xs flex items-center gap-1"
                        title={`Download ${transaction.id}`}
                      >
                        <Download className="h-3 w-3" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                  <div>
                    <p className="font-semibold text-foreground">HBL Credit Card</p>
                    <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-50 text-green-700 border-green-200">Default</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-border">
                  <div>
                    <p className="font-semibold text-foreground">JazzCash Mobile Wallet</p>
                    <p className="text-sm text-muted-foreground">+92 300 1234567</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Remove
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Add Payment Method</Button>
            </Card>

            {/* Billing Settings */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <h3 className="font-bold text-lg text-foreground mb-4">Billing Settings</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-2">Invoice Email Address</p>
                  <p className="text-sm text-muted-foreground mb-2">{user?.email || "user@example.com"}</p>
                  <Button size="sm" variant="outline">
                    Change Email
                  </Button>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Auto-Pay Setup</p>
                  <p className="text-sm text-muted-foreground mb-2">Enable automatic payments for recurring services</p>
                  <Button size="sm" variant="outline">
                    Configure Auto-Pay
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
