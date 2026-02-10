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

interface Gig {
    id: string
    providerId: string
    title: string
    description: string
    category: string
    startingPrice: number
    deliveryTime: string
    tags: string[]
    status: "active" | "draft" | "inactive"
    images: string[]
    rating: number
    reviews: number
    orders: number
    createdAt: string
}

interface CreateGigModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editGig?: Gig | null
}

export function CreateGigModal({ isOpen, onClose, onSuccess, editGig = null }: CreateGigModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        startingPrice: "",
        deliveryTime: "",
        tags: "",
        status: "active",
        images: [] as string[],
    })

    // Pre-fill form when editing
    useEffect(() => {
        if (editGig && isOpen) {
            setFormData({
                title: editGig.title,
                description: editGig.description,
                category: editGig.category,
                startingPrice: editGig.startingPrice.toString(),
                deliveryTime: editGig.deliveryTime,
                tags: editGig.tags.join(", "),
                status: editGig.status,
                images: editGig.images,
            })
        } else if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                title: "",
                description: "",
                category: "",
                startingPrice: "",
                deliveryTime: "",
                tags: "",
                status: "active",
                images: [],
            })
        }
    }, [editGig, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.category || !formData.startingPrice || !formData.deliveryTime) {
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
            const gigData = {
                id: editGig ? editGig.id : `gig-${Date.now()}`,
                providerId: editGig ? editGig.providerId : "current-provider",
                title: formData.title,
                description: formData.description,
                category: formData.category,
                startingPrice: parseInt(formData.startingPrice),
                deliveryTime: formData.deliveryTime,
                tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
                status: formData.status,
                images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"],
                rating: editGig ? editGig.rating : 0,
                reviews: editGig ? editGig.reviews : 0,
                orders: editGig ? editGig.orders : 0,
                createdAt: editGig ? editGig.createdAt : new Date().toISOString(),
            }

            // Get existing gigs
            const storedGigs = localStorage.getItem("providerGigs")
            const gigs = storedGigs ? JSON.parse(storedGigs) : []

            if (editGig) {
                // Update existing gig
                const updatedGigs = gigs.map((g: Gig) => g.id === editGig.id ? gigData : g)
                localStorage.setItem("providerGigs", JSON.stringify(updatedGigs))
            } else {
                // Add new gig
                gigs.push(gigData)
                localStorage.setItem("providerGigs", JSON.stringify(gigs))
            }

            // Dispatch event to update dashboard
            window.dispatchEvent(new Event("new-gig-created"))

            setLoading(false)
            toast({
                title: editGig ? "Gig Updated!" : "Gig Created!",
                description: editGig ? "Your gig has been successfully updated." : "Your gig has been successfully created.",
            })

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                startingPrice: "",
                deliveryTime: "",
                tags: "",
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
            const remainingSlots = 5 - formData.images.length
            const filesToProcess = fileArray.slice(0, remainingSlots)

            // Use FileReader to convert images to base64 for preview
            filesToProcess.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, reader.result as string].slice(0, 5)
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editGig ? "Edit Gig" : "Create New Gig"}</DialogTitle>
                    <DialogDescription>
                        {editGig ? "Update your service offering details." : "Fill in the details to create a new service offering."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Gig Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., Professional Logo Design"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your service in detail..."
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="graphic-design">Graphic Design</SelectItem>
                                    <SelectItem value="video-editing">Video Editing</SelectItem>
                                    <SelectItem value="uiux-design">UI/UX Design</SelectItem>
                                    <SelectItem value="web-development">Web Development</SelectItem>
                                    <SelectItem value="content-writing">Content Writing</SelectItem>
                                    <SelectItem value="seo">SEO Specialist</SelectItem>
                                    <SelectItem value="social-media">Social Media Management</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Starting Price (PKR) <span className="text-red-500">*</span></Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="5000"
                                value={formData.startingPrice}
                                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="delivery">Delivery Time <span className="text-red-500">*</span></Label>
                            <Select value={formData.deliveryTime} onValueChange={(val) => setFormData({ ...formData, deliveryTime: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select delivery time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1 Day">1 Day</SelectItem>
                                    <SelectItem value="2-3 Days">2-3 Days</SelectItem>
                                    <SelectItem value="3-5 Days">3-5 Days</SelectItem>
                                    <SelectItem value="5-7 Days">5-7 Days</SelectItem>
                                    <SelectItem value="1-2 Weeks">1-2 Weeks</SelectItem>
                                    <SelectItem value="2-4 Weeks">2-4 Weeks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags / Keywords (comma separated)</Label>
                        <Input
                            id="tags"
                            placeholder="logo, branding, minimalist"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Helps customers find your gig</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Gig Images</Label>
                        <div className="border-2 border-dashed rounded-lg p-4">
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Upload className="w-8 h-8" />
                                <span className="text-sm">Click to upload images (max 5)</span>
                            </label>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img} alt={`Gig ${index + 1}`} className="w-full h-20 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (editGig ? "Updating..." : "Creating...") : (editGig ? "Update Gig" : "Create Gig")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
