import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Technician } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"

interface JobRequestModalProps {
    technician: Technician
    isOpen: boolean
    onClose: () => void
}

export function JobRequestModal({ technician, isOpen, onClose }: JobRequestModalProps) {
    const { toast } = useToast()
    const { user } = useUser()
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        time: "",
        location: "",
        budget: "",
    })

    // Pre-fill location if user has one
    useEffect(() => {
        if (user?.address) {
            setFormData(prev => ({ ...prev, location: user.address || "" }))
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !date || !formData.time || !formData.location) {
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
            const newRequest = {
                id: `req-${Date.now()}`,
                technicianId: technician.id,
                technicianName: technician.name,
                technicianImage: technician.image,
                customerId: user?.id || "guest",
                customerName: user?.name || "Guest User",
                service: technician.skill,
                title: formData.title,
                description: formData.description,
                date: format(date, "PPP"),
                time: formData.time,
                location: formData.location,
                budget: formData.budget,
                status: "pending",
                serviceType: "onsite", // CRITICAL: Tag as onsite
                createdAt: new Date().toISOString(),
                amount: formData.budget ? parseInt(formData.budget) : 0, // Fallback for credit logic
            }

            // Get existing requests
            const storedRequests = localStorage.getItem("technicianRequests")
            const requests = storedRequests ? JSON.parse(storedRequests) : []
            requests.push(newRequest)
            localStorage.setItem("technicianRequests", JSON.stringify(requests))

            // Also update the 'technicianBookingRequests' in lib/data mock if needed? 
            // Actually, we should rely on a shared store or event for the demo.
            // For now, let's dispatch an event so dashboards update
            window.dispatchEvent(new Event("new-job-request"))

            setLoading(false)
            toast({
                title: "Request Sent!",
                description: "The technician will review your request shortly.",
            })
            onClose()

            // Redirect to customer dashboard to see the request
            router.push("/dashboard/customer")
        }, 1500)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Request Service</DialogTitle>
                    <DialogDescription>
                        Hire {technician.name} for {technician.skill} service.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4 px-1 sm:px-0">
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., Fix leaking tap"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the issue in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="truncate">{date ? format(date, "PPP") : <span>Pick a date</span>}</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Preferred Time <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, time: val })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</SelectItem>
                                    <SelectItem value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</SelectItem>
                                    <SelectItem value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location (Mandatory) <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                className="pl-9"
                                placeholder="Enter full address"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budget">Estimated Budget (Optional)</Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="e.g. 2000"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">This helps the technician understand the scope.</p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading ? "Sending..." : "Send Job Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
