"use client"

import { useState } from "react"
import { Calendar, Upload, CheckCircle2, DollarSign, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface OrderServiceModalProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
    providerName: string
    startingPrice: number
    providerId?: string
    providerImage?: string
}

type OrderStep = "details" | "payment" | "success"

export function OrderServiceModal({
    isOpen,
    onClose,
    serviceTitle,
    providerName,
    startingPrice,
    providerId = "unknown",
    providerImage = "/placeholder.svg",
}: OrderServiceModalProps) {
    const [step, setStep] = useState<OrderStep>("details")
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        projectDetails: "",
        deadline: "",
        budget: "",
        files: null as FileList | null,
        paymentOption: "full",
    })

    const resetForm = () => {
        setStep("details")
        setFormData({
            projectDetails: "",
            deadline: "",
            budget: "",
            files: null,
            paymentOption: "full",
        })
        setLoading(false)
    }

    const handleClose = () => {
        onClose()
        // Reset after transition ends
        setTimeout(resetForm, 300)
    }

    const handleNext = () => {
        if (step === "details") {
            setStep("payment")
        } else if (step === "payment") {
            processOrder()
        }
    }

    const processOrder = () => {
        setLoading(true)

        // Create the digital order object
        const newOrder = {
            id: `order-${Date.now()}`,
            customerId: "guest", // Will be updated when user system is integrated
            providerId: providerId,
            providerName: providerName,
            providerImage: providerImage,
            serviceTitle: serviceTitle,
            description: formData.projectDetails,
            deliveryTime: formData.deadline || "3-5 Days",
            paymentStatus: formData.paymentOption === "full" ? "full" : "partial",
            status: "pending",
            amount: calculateTotal(),
            createdAt: new Date().toISOString(),
        }

        // Save to localStorage
        const stored = localStorage.getItem("digitalOrders")
        const orders = stored ? JSON.parse(stored) : []
        orders.push(newOrder)
        localStorage.setItem("digitalOrders", JSON.stringify(orders))

        // Dispatch event to update dashboard
        window.dispatchEvent(new Event("new-digital-order"))

        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setStep("success")
        }, 1500)
    }

    const calculateTotal = () => {
        // Basic logic using starting price + extra budget if standard format
        // For now, just use starting price as base
        return startingPrice
    }

    const total = calculateTotal()
    const toPay = formData.paymentOption === "half" ? total / 2 : total

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95vw]">
                {step === "success" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl">Order Successfully Placed!</DialogTitle>
                            <DialogDescription className="text-base max-w-sm mx-auto">
                                Your order for <strong>{serviceTitle}</strong> has been received.
                            </DialogDescription>
                        </div>

                        <div className="w-full bg-muted/30 p-4 rounded-lg text-sm text-left mt-4 border border-border/50">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Assigned to:</span>
                                    <span className="font-semibold text-foreground">{providerName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                                        Pending
                                    </Badge>
                                </div>
                                <div className="pt-2 border-t text-center text-muted-foreground text-xs">
                                    You will be notified when the provider accepts your order.
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 w-full">
                            <Button onClick={handleClose} className="w-full">
                                Close & Continue Browsing
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>{step === "details" ? "Order Details" : "Secure Payment"}</DialogTitle>
                            <DialogDescription className="line-clamp-1">
                                Place an order for {serviceTitle} with {providerName}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Progress Indicator */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 px-1">
                                <div className={`flex items-center gap-2 ${step === "details" ? "text-primary font-medium" : ""}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step === "details" ? "border-primary bg-primary/10 text-primary" : step === "payment" ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>
                                        {step === "payment" ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
                                    </div>
                                    Details
                                </div>
                                <div className="h-[1px] flex-1 bg-border" />
                                <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary font-medium" : ""}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step === "payment" ? "border-primary bg-primary/10 text-primary" : "border-muted-foreground"}`}>
                                        2
                                    </div>
                                    Payment
                                </div>
                            </div>

                            {step === "details" && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="project-details">Project Requirements <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="project-details"
                                            placeholder="Describe your project, goals, and any specific requirements..."
                                            className="min-h-[100px]"
                                            value={formData.projectDetails}
                                            onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="deadline">Preferred Deadline</Label>
                                            <Input
                                                id="deadline"
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="budget">Budget (PKR)</Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                placeholder="Enter budget"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="files">Attachments</Label>
                                        <div className="border border-input rounded-md p-3">
                                            <Input
                                                id="files"
                                                type="file"
                                                multiple
                                                className="border-0 p-0 file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:text-sm file:font-medium hover:file:bg-secondary/80 h-auto"
                                                onChange={(e) => setFormData({ ...formData, files: e.target.files })}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Files will be reviewed manually by provider.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === "payment" && (
                                <div className="space-y-6">
                                    <div className="rounded-lg border p-4 bg-muted/20 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Service:</span>
                                            <span className="font-medium truncate max-w-[150px]">{serviceTitle}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Provider:</span>
                                            <span className="font-medium truncate max-w-[150px]">{providerName}</span>
                                        </div>
                                        <div className="h-[1px] bg-border" />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total Estimate:</span>
                                            <span>PKR {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Select Payment Option</Label>
                                        <RadioGroup
                                            value={formData.paymentOption}
                                            onValueChange={(val) => setFormData({ ...formData, paymentOption: val })}
                                            className="gap-3"
                                        >
                                            <div className={`relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/5 ${formData.paymentOption === 'full' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                                                <RadioGroupItem value="full" id="full" className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor="full" className="font-medium cursor-pointer block">Full Payment</Label>
                                                    <p className="text-xs text-muted-foreground mt-1">Pay 100% upfront.</p>
                                                </div>
                                                <div className="font-semibold text-sm">PKR {total.toLocaleString()}</div>
                                            </div>

                                            <div className={`relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/5 ${formData.paymentOption === 'half' ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}>
                                                <RadioGroupItem value="half" id="half" className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor="half" className="font-medium cursor-pointer block">50% Advance</Label>
                                                    <p className="text-xs text-muted-foreground mt-1">Pay 50% now to start.</p>
                                                </div>
                                                <div className="font-semibold text-sm">PKR {(total / 2).toLocaleString()}</div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {step === "details" ? (
                                <Button onClick={handleNext} className="w-full" disabled={!formData.projectDetails}>
                                    Continue to Payment
                                </Button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <Button variant="outline" onClick={() => setStep("details")} className="w-full sm:w-auto" disabled={loading}>
                                        Back
                                    </Button>
                                    <Button onClick={handleNext} className="w-full sm:flex-1" disabled={loading}>
                                        {loading && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? "Processing..." : `Pay PKR ${toPay.toLocaleString()}`}
                                    </Button>
                                </div>
                            )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
