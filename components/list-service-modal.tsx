"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

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

interface ListServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editService?: TechnicianService | null
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function ListServiceModal({ isOpen, onClose, onSuccess, editService = null }: ListServiceModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        city: "",
        area: "",
        startingPrice: "",
        availabilityDays: [] as string[],
        timeFrom: "",
        timeTo: "",
        experience: "",
        status: "active",
        images: [] as string[],
    })

    // Pre-fill form when editing
    useEffect(() => {
        if (editService && isOpen) {
            setFormData({
                title: editService.title,
                description: editService.description,
                category: editService.category,
                city: editService.city,
                area: editService.area,
                startingPrice: editService.startingPrice.toString(),
                availabilityDays: editService.availability.days,
                timeFrom: editService.availability.timeFrom,
                timeTo: editService.availability.timeTo,
                experience: editService.experience.toString(),
                status: editService.status,
                images: editService.images,
            })
        } else if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                title: "",
                description: "",
                category: "",
                city: "",
                area: "",
                startingPrice: "",
                availabilityDays: [],
                timeFrom: "",
                timeTo: "",
                experience: "",
                status: "active",
                images: [],
            })
        }
    }, [editService, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.category || !formData.city ||
            !formData.area || !formData.startingPrice || !formData.experience ||
            formData.availabilityDays.length === 0 || !formData.timeFrom || !formData.timeTo) {
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        // Simulate API call / Save to LocalStorage
        setTimeout(() => {
            const serviceData = {
                id: editService ? editService.id : `service-${Date.now()}`,
                technicianId: editService ? editService.technicianId : "current-technician",
                title: formData.title,
                description: formData.description,
                category: formData.category,
                city: formData.city,
                area: formData.area,
                startingPrice: parseInt(formData.startingPrice),
                availability: {
                    days: formData.availabilityDays,
                    timeFrom: formData.timeFrom,
                    timeTo: formData.timeTo,
                },
                experience: parseInt(formData.experience),
                status: formData.status,
                images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"],
                createdAt: editService ? editService.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            // Get existing services
            const storedServices = localStorage.getItem("technicianLocalServices")
            const services = storedServices ? JSON.parse(storedServices) : []

            if (editService) {
                // Update existing service
                const updatedServices = services.map((s: TechnicianService) => s.id === editService.id ? serviceData : s)
                localStorage.setItem("technicianLocalServices", JSON.stringify(updatedServices))
            } else {
                // Add new service
                services.push(serviceData)
                localStorage.setItem("technicianLocalServices", JSON.stringify(services))
            }

            // Dispatch event to update dashboard
            window.dispatchEvent(new Event("new-service-listed"))

            setLoading(false)
            toast({
                title: editService ? "Service Updated!" : "Service Listed!",
                description: editService ? "Your service has been successfully updated." : "Your service has been successfully listed.",
            })

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                city: "",
                area: "",
                startingPrice: "",
                availabilityDays: [],
                timeFrom: "",
                timeTo: "",
                experience: "",
                status: "active",
                images: [],
            })

            onSuccess()
            onClose()
        }, 1000)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)
            const remainingSlots = 3 - formData.images.length
            const filesToProcess = fileArray.slice(0, remainingSlots)

            filesToProcess.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const result = reader.result as string
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, result].slice(0, 3)
                    }))
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        setFormData({ ...formData, images: newImages })
    }

    const toggleDay = (day: string) => {
        const newDays = formData.availabilityDays.includes(day)
            ? formData.availabilityDays.filter(d => d !== day)
            : [...formData.availabilityDays, day]
        setFormData({ ...formData, availabilityDays: newDays })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editService ? "Edit Service" : "List Your Service"}</DialogTitle>
                    <DialogDescription>
                        {editService ? "Update your local service offering details." : "Fill in the details to list your local service offering."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., AC Repair at Home"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Service Category <span className="text-red-500">*</span></Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ac-repair">AC Repair</SelectItem>
                                    <SelectItem value="electrician">Electrician</SelectItem>
                                    <SelectItem value="plumber">Plumber</SelectItem>
                                    <SelectItem value="carpenter">Carpenter</SelectItem>
                                    <SelectItem value="painter">Painter</SelectItem>
                                    <SelectItem value="refrigerator-repair">Refrigerator Repair</SelectItem>
                                    <SelectItem value="washing-machine-repair">Washing Machine Repair</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                            <Select value={formData.city} onValueChange={(val) => setFormData({ ...formData, city: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="karachi">Karachi</SelectItem>
                                    <SelectItem value="lahore">Lahore</SelectItem>
                                    <SelectItem value="islamabad">Islamabad</SelectItem>
                                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                                    <SelectItem value="multan">Multan</SelectItem>
                                    <SelectItem value="peshawar">Peshawar</SelectItem>
                                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area">Area <span className="text-red-500">*</span></Label>
                        <Input
                            id="area"
                            placeholder="e.g., DHA Phase 6"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Starting Price (PKR) <span className="text-red-500">*</span></Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="2000"
                                value={formData.startingPrice}
                                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience (Years) <span className="text-red-500">*</span></Label>
                            <Input
                                id="experience"
                                type="number"
                                placeholder="5"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Availability (Days) <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-3">
                            {DAYS_OF_WEEK.map((day) => (
                                <div key={day} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={day}
                                        checked={formData.availabilityDays.includes(day)}
                                        onCheckedChange={() => toggleDay(day)}
                                    />
                                    <label
                                        htmlFor={day}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {day}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="timeFrom">Available From <span className="text-red-500">*</span></Label>
                            <Input
                                id="timeFrom"
                                type="time"
                                value={formData.timeFrom}
                                onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeTo">Available To <span className="text-red-500">*</span></Label>
                            <Input
                                id="timeTo"
                                type="time"
                                value={formData.timeTo}
                                onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Service Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            placeholder="Home visit, diagnosis, and repair included. Genuine parts used."
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Service Photos</Label>

                        {/* Featured Preview */}
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-muted bg-muted/30 group">
                            {formData.images.length > 0 ? (
                                <img
                                    src={formData.images[0]}
                                    alt="Service Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                    <div className="p-4 bg-muted rounded-full">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm font-medium">Main Photo Preview</p>
                                    <p className="text-xs">Select or upload photos below</p>
                                </div>
                            )}
                            {formData.images.length > 0 && (
                                <div className="absolute bottom-3 left-3 bg-primary/90 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
                                    Featured Image
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/20 relative">
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <Upload className="w-8 h-8" />
                                    <span className="font-semibold text-xs text-foreground">Add Photos</span>
                                    <span className="text-[10px]">Max 3 images</span>
                                </label>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border shadow-sm group">
                                            <img src={img} alt={`Service ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute top-0 left-0 bg-primary text-[8px] text-white px-1.5 py-0.5 rounded-br font-bold">
                                                    MAIN
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (editService ? "Updating..." : "Listing...") : (editService ? "Update Service" : "List Your Service")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
