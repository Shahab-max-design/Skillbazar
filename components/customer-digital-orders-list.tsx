"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Package } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

interface DigitalOrder {
    id: string
    customerId?: string
    providerId: string
    providerName: string
    providerImage: string
    serviceTitle: string
    description: string
    deliveryTime: string
    paymentStatus: "full" | "partial"
    status: "pending" | "in-progress" | "completed" | "cancelled"
    amount: number
    createdAt: string
}

export function CustomerDigitalOrdersList() {
    const { user } = useUser()
    const [orders, setOrders] = useState<DigitalOrder[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isRefreshing, setIsRefreshing] = useState(false)

    const loadOrders = () => {
        setIsRefreshing(true)
        const stored = localStorage.getItem("digitalOrders")
        if (stored) {
            try {
                const allOrders: DigitalOrder[] = JSON.parse(stored)
                const userId = user?.id

                const myOrders = allOrders.filter(
                    o => (!o.customerId || (userId && String(o.customerId) === String(userId)) || !userId)
                ).reverse() // Newest first

                setOrders(myOrders)
            } catch (e) {
                console.error("Failed to parse digital orders", e)
            }
        }
        setIsRefreshing(false)
    }

    useEffect(() => {
        loadOrders()
        // Listen for updates
        window.addEventListener("new-digital-order", loadOrders)
        return () => {
            window.removeEventListener("new-digital-order", loadOrders)
        }
    }, [user])

    const handleCancel = (id: string) => {
        const stored = localStorage.getItem("digitalOrders")
        if (stored) {
            const allOrders: DigitalOrder[] = JSON.parse(stored)
            const updatedOrders = allOrders.map(o =>
                o.id === id ? { ...o, status: "cancelled" as const } : o
            )
            localStorage.setItem("digitalOrders", JSON.stringify(updatedOrders))

            // Dispatch event to update other components
            window.dispatchEvent(new Event("new-digital-order"))
            loadOrders()
        }
    }

    if (orders.length === 0) {
        return (
            <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No Digital Orders</h3>
                    <p className="text-muted-foreground mb-6">You haven't placed any digital service orders yet.</p>
                    <Link href="/services?type=digital">
                        <Button>Browse Digital Services</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full border-l-4"
                    style={{ borderLeftColor: getStatusColor(order.status) }}>
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={order.providerImage || "/placeholder.svg"}
                                    alt={order.providerName}
                                    className="w-12 h-12 rounded-full object-cover border border-border"
                                />
                                <div>
                                    <h3 className="font-semibold text-foreground line-clamp-1">{order.providerName}</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{order.serviceTitle}</p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${getStatusBadgeColor(order.status)} border-0 font-medium`}
                            >
                                {order.status === "in-progress" ? "In Progress" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </div>

                        <div className="mb-4 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{order.description}</p>

                            <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">Delivery: {order.deliveryTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className="truncate">Payment: {order.paymentStatus === "full" ? "Full Payment" : "50% Advance"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-xs">Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions / Footer */}
                        <div className="pt-4 mt-auto border-t border-border">
                            {order.status === "pending" ? (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => handleCancel(order.id)}
                                    >
                                        Cancel Order
                                    </Button>
                                </div>
                            ) : order.status === "in-progress" ? (
                                <div className="space-y-2">
                                    <div className="p-2 bg-blue-50 rounded border border-blue-100 flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Work in Progress</p>
                                            <p className="text-xs text-blue-600 mt-0.5">The provider is working on your order.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : order.status === "completed" ? (
                                <div className="space-y-2">
                                    <div className="p-2 bg-green-50 rounded border border-green-100 flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Order Completed</p>
                                            <p className="text-xs text-green-600 mt-0.5">Your order has been delivered.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground text-center italic">
                                    You cancelled this order
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'completed': return '#22c55e'; // green-500
        case 'in-progress': return '#3b82f6'; // blue-500
        case 'pending': return '#f59e0b'; // amber-500
        case 'cancelled': return '#94a3b8'; // slate-400
        default: return '#cbd5e1'; // slate-300
    }
}

function getStatusBadgeColor(status: string) {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'cancelled': return 'bg-slate-100 text-slate-600';
        default: return 'bg-slate-100 text-slate-800';
    }
}
