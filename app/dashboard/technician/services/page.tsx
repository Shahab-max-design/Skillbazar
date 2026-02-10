"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, Edit, Trash2, Eye } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { ListServiceModal } from "@/components/list-service-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TechnicianService {
    id: string
    technicianId: string
    title: string
    description: string
    category: string
    city: string
    area: string
    startingPrice: number
    availability: {
        days: string[]
        timeFrom: string
        timeTo: string
    }
    experience: number
    status: "active" | "inactive"
    images: string[]
    createdAt: string
    updatedAt: string
}

// Role guard
function useRoleGuard(router: ReturnType<typeof useRouter>) {
    useEffect(() => {
        if (typeof window === "undefined") return
        const role = localStorage.getItem("userRole")
        if (role !== "technician") {
            router.push("/unauthorized")
        }
    }, [router])
}

export default function TechnicianServicesPage() {
    const router = useRouter()
    useRoleGuard(router)
    const { user } = useUser()
    const [services, setServices] = useState<TechnicianService[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<TechnicianService | null>(null)
    const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)

    const loadServices = () => {
        const stored = localStorage.getItem("technicianLocalServices")
        if (stored) {
            try {
                const allServices: TechnicianService[] = JSON.parse(stored)
                setServices(allServices)
            } catch (e) {
                console.error("Failed to parse services", e)
            }
        }
    }

    useEffect(() => {
        loadServices()
        // Listen for new services
        window.addEventListener("new-service-listed", loadServices)
        return () => {
            window.removeEventListener("new-service-listed", loadServices)
        }
    }, [])

    const handleEdit = (service: TechnicianService) => {
        setEditingService(service)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        const stored = localStorage.getItem("technicianLocalServices")
        if (stored) {
            const allServices: TechnicianService[] = JSON.parse(stored)
            const updatedServices = allServices.filter(s => s.id !== id)
            localStorage.setItem("technicianLocalServices", JSON.stringify(updatedServices))
            window.dispatchEvent(new Event("new-service-listed"))
            loadServices()
            setDeletingServiceId(null)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingService(null)
    }

    const formatCategory = (category: string) => {
        return category
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    const formatTime = (time: string) => {
        if (!time) return ""
        const [hours, minutes] = time.split(":")
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    return (
        <div className="min-h-screen bg-muted">
            <DashboardSidebar type="technician" />

            <div className="lg:ml-64">
                <DashboardHeader
                    title="My Services"
                    userName={user?.name || "Technician"}
                    userRole="Onsite Technician"
                    profilePicture={user?.profilePicture}
                />

                <main className="p-4 lg:p-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">My Services</h1>
                            <p className="text-muted-foreground">Manage your local service offerings</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>+ List Your Service</Button>
                    </div>

                    {services.length === 0 ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground">No Services Yet</h3>
                                <p className="text-muted-foreground mb-6">List your first service to start receiving requests.</p>
                                <Button onClick={() => setIsModalOpen(true)}>List Your First Service</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map(service => (
                                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-48 overflow-hidden bg-muted">
                                        <img
                                            src={service.images[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge className={
                                                service.status === "active"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-500 text-white"
                                            }>
                                                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-5">
                                        <div className="mb-3">
                                            <h3 className="font-semibold text-foreground text-lg line-clamp-1">{service.title}</h3>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{formatCategory(service.category)}</p>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Location</span>
                                                <span className="font-medium text-foreground">{service.city}, {service.area}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Experience</span>
                                                <span className="font-medium text-foreground">{service.experience} years</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                                            <div>
                                                <p className="text-muted-foreground text-xs">Starting at</p>
                                                <p className="font-bold text-foreground text-lg">PKR {service.startingPrice.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {deletingServiceId === service.id ? (
                                            <div className="pt-4 border-t border-border">
                                                <p className="text-sm text-foreground mb-3">Are you sure you want to delete this service?</p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleDelete(service.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => setDeletingServiceId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div className="text-sm text-muted-foreground">
                                                    Listed {new Date(service.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-2"
                                                        onClick={() => handleEdit(service)}
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 px-2">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeletingServiceId(service.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <ListServiceModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={() => loadServices()}
                editService={editingService}
            />
        </div>
    )
}
