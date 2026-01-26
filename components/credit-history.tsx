"use client"

import { useEffect, useState } from "react"
import { CreditTransaction, getCreditHistory } from "@/lib/credits"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"

export function CreditHistory() {
    const [transactions, setTransactions] = useState<CreditTransaction[]>([])

    useEffect(() => {
        // Load initial history
        setTransactions(getCreditHistory())

        // Listen for storage events to update real-time if multiple tabs open
        const handleStorageChange = () => {
            setTransactions(getCreditHistory())
        }

        // Custom event listener for same-tab updates
        window.addEventListener("credits-updated", handleStorageChange)
        window.addEventListener("storage", handleStorageChange)

        return () => {
            window.removeEventListener("credits-updated", handleStorageChange)
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    if (transactions.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Credit History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">No credit transactions yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Credit History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => {
                        const isDeduction = transaction.amount < 0
                        return (
                            <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isDeduction ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                        {isDeduction ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{transaction.reason}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(transaction.date), "MMM d, yyyy h:mm a")}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-bold ${isDeduction ? "text-red-600" : "text-green-600"}`}>
                                    {isDeduction ? "" : "+"}{transaction.amount}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
