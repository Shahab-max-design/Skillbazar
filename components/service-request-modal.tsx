"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, MapPin, ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Technician } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

interface ServiceRequestModalProps {
    technician: Technician
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function ServiceRequestModal({ technician, isOpen, onClose, onSuccess }: ServiceRequestModalProps) {
    const { toast } = useToast()
    const { user } = useUser()
    const [date, setDate] = useState<Date>()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        serviceRequired: technician.skill,
        problemDescription: "",
        address: "",
        budget: "",
    })

    // Pre-fill address if user has one
    useEffect(() => {
        if (user?.area) {
            setFormData(prev => ({ ...prev, address: user.area || "" }))
        }
    }, [user])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submit clicked")

        if (!formData.serviceRequired || !formData.problemDescription || !formData.address || !date) {
            console.log("Validation failed:", {
                serviceRequired: !!formData.serviceRequired,
                problemDescription: !!formData.problemDescription,
                address: !!formData.address,
                date: !!date
            })
            toast({
                title: "Missing fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        console.log("Technician data:", technician)

        try {
            const data = new FormData()
            data.append("technician_id", technician.id)
            data.append("technician_name", technician.name)
            data.append("technician_image", technician.image || "")
            data.append("service_required", formData.serviceRequired)
            data.append("description", formData.problemDescription)
            data.append("address", formData.address)
            data.append("preferred_date", format(date, "yyyy-MM-dd"))
            data.append("budget", formData.budget)
            if (image) {
                data.append("image", image)
            }

            console.log("Calling API with data:", Object.fromEntries(data.entries()))
            const response = await fetch("/api/technician-request", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user?.email || "anonymous"}`
                },
                body: data,
            })

            const result = await response.json()
            console.log("Response:", result)

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Your request has been sent successfully.",
                })
                onSuccess()
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Something went wrong.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Fetch Error:", error)
            toast({
                title: "Error",
                description: "Failed to send request. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Custom Overlay and Content to fix clipping */}
            <DialogPortal>
                <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto flex items-center justify-center p-4">
                    <div className="bg-background w-full max-w-lg rounded-lg shadow-lg relative animate-in fade-in zoom-in duration-200">
                        {/* Close button provided by DialogContent usually, adding it here or ensuring Dialog does it */}
                        <div className="p-6">
                            <DialogHeader className="mb-4">
                                <DialogTitle>Send Service Request</DialogTitle>
                                <DialogDescription>
                                    Request service from {technician.name} ({technician.skill}).
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="serviceRequired">Service Required <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="serviceRequired"
                                        placeholder="e.g., AC Repair, Electrical Wiring"
                                        value={formData.serviceRequired}
                                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="problemDescription">Problem Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="problemDescription"
                                        placeholder="Briefly describe the issue..."
                                        value={formData.problemDescription}
                                        onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                                        required
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            placeholder="Enter your full address"
                                            className="pl-9"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Preferred Date <span className="text-red-500">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Budget (Optional)</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            placeholder="e.g., 2000"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Attach Image (Optional)</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors block"
                                    >
                                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            {image ? `Selected: ${image.name}` : "Click to upload image of the problem"}
                                        </p>
                                    </label>
                                </div>

                                <DialogFooter className="pt-4 gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
                                        disabled={loading}
                                        onClick={() => console.log("Submit button clicked directly")}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : "Submit Request"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </div>
                </div>
            </DialogPortal>
        </Dialog>
    )
}
