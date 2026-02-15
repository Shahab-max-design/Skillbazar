"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

interface Request {
    id: string
    customerId?: string
    technicianId: string
    technicianName: string
    technicianImage: string
    service: string
    title: string
    description: string
    date: string
    time: string
    location: string
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
    amount: number
    serviceType: "onsite" | "digital"
}

export function CustomerRequestList() {
    const { user } = useUser()
    const [requests, setRequests] = useState<Request[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isRefreshing, setIsRefreshing] = useState(false)

    const loadRequests = async () => {
        if (!user?.email) return

        setIsRefreshing(true)
        try {
            const response = await fetch("/api/my-requests", {
                headers: {
                    "Authorization": `Bearer ${user.email}`
                }
            })
            const result = await response.json()

            console.log("API Response:", result)

            if (result.success) {
                // The API returns two arrays, we use technicianRequests for this component
                const technicianRequests = (result.technicianRequests || []).map((r: any) => ({
                    ...r,
                    technicianName: r.technician_name || r.technicianName || "Technician",
                    technicianImage: r.technician_image || r.technicianImage,
                    service: r.service_required || r.serviceRequired,
                    title: r.service_required || r.serviceRequired,
                    description: r.description || r.problemDescription,
                    date: r.preferred_date || r.preferredDate,
                    time: "N/A",
                    location: r.address,
                    serviceType: "onsite" as const
                }))
                setRequests(technicianRequests.reverse())
            }
        } catch (e) {
            console.error("Failed to fetch requests from API", e)
        } finally {
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        loadRequests()
        // Listen for updates
        window.addEventListener("new-job-request", loadRequests)
        window.addEventListener("credits-updated", loadRequests)
        return () => {
            window.removeEventListener("new-job-request", loadRequests)
            window.removeEventListener("credits-updated", loadRequests)
        }
    }, [user])

    const handleCancel = (id: string) => {
        // Removed confirm dialog for smoother UX as requested
        // if (!confirm("Are you sure you want to cancel this request?")) return

        const stored = localStorage.getItem("technicianRequests")
        if (stored) {
            const allRequests: Request[] = JSON.parse(stored)
            const updatedRequests = allRequests.map(r =>
                r.id === id ? { ...r, status: "cancelled" as const } : r
            )
            localStorage.setItem("technicianRequests", JSON.stringify(updatedRequests))

            // Dispatch event to update other components
            window.dispatchEvent(new Event("new-job-request"))
            loadRequests()
        }
    }

    if (requests.length === 0) {
        return (
            <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No Onsite Requests</h3>
                    <p className="text-muted-foreground mb-6">You haven't sent any onsite job requests yet.</p>
                    <Link href="/technicians">
                        <Button>Find a Professional</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full border-l-4"
                    style={{ borderLeftColor: getStatusColor(request.status) }}>
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={request.technicianImage || "/placeholder.svg"}
                                    alt={request.technicianName}
                                    className="w-12 h-12 rounded-full object-cover border border-border"
                                />
                                <div>
                                    <h3 className="font-semibold text-foreground line-clamp-1">{request.technicianName}</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{request.service}</p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${getStatusBadgeColor(request.status)} border-0 font-medium`}
                            >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                        </div>

                        <div className="mb-4 flex-grow">
                            <h4 className="font-semibold text-foreground mb-2 text-lg line-clamp-1">{request.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{request.description}</p>

                            <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">{request.date}</span>
                                    <span className="text-xs">• {request.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="truncate">{request.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions / Footer */}
                        <div className="pt-4 mt-auto border-t border-border">
                            {request.status === "pending" ? (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        onClick={() => handleCancel(request.id)}
                                    >
                                        Cancel Request
                                    </Button>
                                    {/* Edit button placeholder - kept simple for now */}
                                </div>
                            ) : request.status === "accepted" ? (
                                <div className="space-y-2">
                                    <div className="p-2 bg-green-50 rounded border border-green-100 flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Technician Accepted</p>
                                            <p className="text-xs text-green-600 mt-0.5">They will contact you shortly.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : request.status === "rejected" ? (
                                <div className="text-sm text-red-600 flex items-center gap-2 justify-center py-2 bg-red-50 rounded">
                                    <XCircle className="w-4 h-4" />
                                    Request was declined
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground text-center italic">
                                    {request.status === "cancelled" ? "You cancelled this request" : "Job Completed"}
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
        case 'accepted': return '#22c55e'; // green-500
        case 'pending': return '#f59e0b'; // amber-500
        case 'rejected': return '#ef4444'; // red-500
        case 'cancelled': return '#94a3b8'; // slate-400
        default: return '#cbd5e1'; // slate-300
    }
}

function getStatusBadgeColor(status: string) {
    switch (status) {
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'cancelled': return 'bg-slate-100 text-slate-600';
        default: return 'bg-slate-100 text-slate-800';
    }
}
