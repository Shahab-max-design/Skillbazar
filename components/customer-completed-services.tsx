"use client"

import React, { useState, useEffect } from "react"
import {
    Star,
    ShieldCheck,
    MessageSquare,
    UserCheck,
    BarChart3,
    CheckCircle2,
    ExternalLink,
    Award,
    Send,
    Check,
    ChevronDown,
    ChevronUp,
    Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"
import { format } from "date-fns"

// Storage keys
const RATINGS_STORAGE_KEY = "skillbazaar_completed_services_ratings"

// Initial Dummy Data
const INITIAL_DATA = [
    {
        id: "cs-1",
        name: "Ahmed Khan",
        role: "Technician",
        serviceTitle: "AC Installation & Gas Refill",
        completedJobs: 15,
        averageRating: 4.8,
        image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop",
        completedAt: "2024-02-10",
        hasRated: false,
        status: "completed"
    },
    {
        id: "cs-2",
        name: "Sara Ahmed",
        role: "Freelancer",
        serviceTitle: "Modern UI/UX Dashboard Design",
        completedJobs: 8,
        averageRating: 4.9,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        completedAt: "2024-02-12",
        hasRated: false,
        status: "completed"
    },
    {
        id: "cs-3",
        name: "Zubair Siddiqui",
        role: "Technician",
        serviceTitle: "Electrical Wiring Fix",
        completedJobs: 1,
        averageRating: 3.5,
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
        completedAt: "2024-02-14",
        hasRated: false,
        status: "completed"
    },
    {
        id: "cs-4",
        name: "Fatima Noor",
        role: "Freelancer",
        serviceTitle: "React Website Bug Fixing",
        completedJobs: 0,
        averageRating: 0,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        completedAt: "2024-02-15",
        hasRated: false,
        status: "completed"
    }
]

const StarDisplay = ({ rating, size = 4 }: { rating: number; size?: number }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`w-${size} h-${size} ${s <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground/30'}`}
                />
            ))}
        </div>
    )
}

export const CustomerCompletedServices: React.FC = () => {
    const { user } = useUser()
    const [providers, setProviders] = useState(INITIAL_DATA)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<any>(null)
    const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})

    // Rating State
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Persistence Logic: Load ratings from localStorage
    useEffect(() => {
        const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY)
        if (storedRatings) {
            try {
                const ratingsMap = JSON.parse(storedRatings)
                setProviders(prev => prev.map(p => {
                    const ratingData = ratingsMap[p.id]
                    if (ratingData) {
                        return {
                            ...p,
                            hasRated: true,
                            status: "rated",
                            customerRating: ratingData.value,
                            reviewText: ratingData.text,
                            reviewDate: ratingData.createdAt,
                            averageRating: ratingData.newAverage || p.averageRating
                        }
                    }
                    return p
                }))
            } catch (error) {
                console.error("Failed to parse stored ratings:", error)
            }
        }
    }, [])

    const toggleReviewExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleOpenRating = (provider: any) => {
        if (provider.status === "rated") return;
        setSelectedProvider(provider)
        setRating(0)
        setFeedback("")
        setIsModalOpen(true)
    }

    const handleSubmitRating = async () => {
        if (rating === 0) return
        if (!selectedProvider) return

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/rate-professional", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer mock-token"
                },
                body: JSON.stringify({
                    bookingId: selectedProvider.id,
                    technicianId: selectedProvider.id,
                    customerId: user?.id || "mock-customer-id",
                    ratingValue: rating,
                    reviewText: feedback
                })
            })

            const result = await response.json()

            if (result.success) {
                const ratingInfo = result.data.rating;

                // Update local state and persistence
                const newProviders = providers.map(p => {
                    if (p.id === selectedProvider.id) {
                        return {
                            ...p,
                            status: "rated",
                            hasRated: true,
                            customerRating: rating,
                            reviewText: feedback,
                            reviewDate: ratingInfo.createdAt,
                            averageRating: result.data.newAverageRating,
                            completedJobs: p.completedJobs + 1
                        }
                    }
                    return p
                })

                setProviders(newProviders)

                // Save to localStorage
                const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY)
                const ratingsMap = storedRatings ? JSON.parse(storedRatings) : {}
                ratingsMap[selectedProvider.id] = {
                    value: rating,
                    text: feedback,
                    createdAt: ratingInfo.createdAt,
                    newAverage: result.data.newAverageRating,
                    timestamp: new Date().toISOString()
                }
                localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratingsMap))

                toast.success("Thank you for your feedback!", {
                    description: "Your rating has been submitted successfully."
                })
                setIsModalOpen(false)
            } else {
                toast.error(result.message || "Failed to submit rating.")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 py-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Completed Services</h2>
                    <p className="text-sm text-muted-foreground font-medium">Manage and rate your recently completed service bookings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1.5 rounded-full flex gap-2 items-center text-xs font-bold shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {providers.length} Total Services
                    </Badge>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => {
                    const isVerifiedAndTrusted = provider.completedJobs >= 1 && provider.averageRating >= 4.0
                    const isRated = provider.status === "rated"
                    const isExpanded = expandedReviews[provider.id]

                    return (
                        <Card
                            key={provider.id}
                            className={`group relative border transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-visible ${isRated ? 'border-green-500/50 bg-green-500/[0.03]' : 'border-border/50 bg-card/50'
                                } backdrop-blur-md hover:border-primary/40 flex flex-col`}
                        >
                            {isVerifiedAndTrusted && (
                                <div className="absolute -top-3 left-6 z-20">
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-white/20 shadow-lg px-3 py-1 flex gap-1.5 items-center text-[10px] font-black uppercase tracking-widest ring-2 ring-white">
                                        <Award className="w-3 h-3" />
                                        Verified & Trusted
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="p-6 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="relative">
                                        <Avatar className="w-16 h-16 border-2 border-primary/10 group-hover:border-primary/50 transition-all duration-500 shadow-sm">
                                            <AvatarImage src={provider.image} alt={provider.name} className="object-cover" />
                                            <AvatarFallback className="bg-primary/5 text-primary font-bold italic">
                                                {provider.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${provider.role === 'Technician' ? 'bg-blue-500' : 'bg-purple-500'}`} title={provider.role}></div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                                            <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-xs font-black text-foreground">{provider.completedJobs} <span className="text-[10px] text-muted-foreground uppercase opacity-70">Jobs</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-black group-hover:text-primary transition-colors">
                                            {provider.name}
                                        </CardTitle>
                                        {isRated && <Check className="w-5 h-5 text-green-500 animate-in zoom-in duration-500" />}
                                    </div>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <ShieldCheck className={`w-3 h-3 ${isVerifiedAndTrusted ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                                        {provider.role}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 pt-0 flex flex-col flex-1">
                                <div className="text-sm font-bold text-foreground/90 mb-4 flex items-start gap-2 h-10 line-clamp-2 overflow-hidden">
                                    <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-primary" />
                                    {provider.serviceTitle}
                                </div>

                                <div className="bg-muted/30 rounded-2xl p-4 flex justify-between items-center mb-4 border border-border/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-60">Avg Rating</span>
                                        <div className="flex items-center gap-1.5">
                                            {provider.averageRating > 0 ? (
                                                <>
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                                                    <span className="text-base font-black text-foreground leading-none">{(provider.averageRating as number).toFixed(1)}</span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground/60 italic font-bold">No rating yet</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-8 w-px bg-border/50" />

                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-60">Status</span>
                                        <span className={`text-[11px] font-black flex gap-1 items-center ${isRated ? 'text-green-600' : 'text-primary'}`}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {isRated ? 'Rated' : 'Completed'}
                                        </span>
                                    </div>
                                </div>

                                {isRated ? (
                                    <div className="flex-1 space-y-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/40 border border-green-500/10">
                                            <div className="flex justify-between items-center">
                                                <StarDisplay rating={provider.customerRating} />
                                                <span className="text-[10px] font-black text-green-600 italic">
                                                    {provider.customerRating}/5
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <p className={`text-xs text-muted-foreground italic leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                    {provider.reviewText ? `"${provider.reviewText}"` : "No written review provided."}
                                                </p>
                                                {provider.reviewText && provider.reviewText.length > 80 && (
                                                    <button
                                                        onClick={(e) => toggleReviewExpand(provider.id, e)}
                                                        className="text-[10px] font-black text-primary hover:underline mt-1 flex items-center gap-0.5"
                                                    >
                                                        {isExpanded ? (
                                                            <>Show less <ChevronUp className="w-3 h-3" /></>
                                                        ) : (
                                                            <>Read more <ChevronDown className="w-3 h-3" /></>
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-border/10">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-[10px] font-medium text-muted-foreground/70">
                                                    Reviewed on: {provider.reviewDate ? format(new Date(provider.reviewDate), "d MMM yyyy") : "Date unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 mt-auto">
                                        <Button
                                            variant="default"
                                            className="flex-1 rounded-xl h-12 text-xs font-black uppercase tracking-widest gap-2 transition-all duration-300 bg-primary hover:bg-primary/90 shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
                                            onClick={() => handleOpenRating(provider)}
                                        >
                                            <Star className="w-4 h-4" />
                                            Rate Now
                                        </Button>
                                        <Button variant="outline" className="rounded-xl h-12 w-12 shrink-0 border-border/40 hover:bg-primary/5 hover:text-primary transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                {isRated && (
                                    <div className="mt-auto">
                                        <Button variant="outline" className="w-full rounded-xl h-12 shrink-0 border-border/40 hover:bg-primary/5 hover:text-primary transition-all text-xs font-black uppercase tracking-widest gap-2 opacity-50 cursor-not-allowed">
                                            <ExternalLink className="w-4 h-4" />
                                            View Booking
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Rating Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary/5 p-6 pb-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                    <Star className="w-6 h-6 text-white fill-white" />
                                </div>
                                Rate Professional
                            </h2>
                            <p className="text-sm font-medium text-muted-foreground mt-2 pl-1">
                                Your feedback helps <span className="text-primary font-bold">@{selectedProvider?.name}</span> grow!
                            </p>
                        </div>
                    </div>

                    <div className="p- thick relative z-10 -mt-20 p-6">
                        <div className="bg-card rounded-[2rem] shadow-xl border border-border/40 p-6 space-y-8">
                            {/* Star Selection Logic */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center block">
                                    How satisfied are you with the work?
                                </label>
                                <div className="flex justify-center items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 group transition-transform active:scale-95"
                                        >
                                            <Star
                                                className={`w-10 h-10 transition-all duration-300 ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-500 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                                    : 'text-muted-foreground/30'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center h-4">
                                    {rating > 0 && (
                                        <span className="text-xs font-black text-primary uppercase animate-in fade-in slide-in-from-bottom-2">
                                            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : 'Thank You!'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Feedback Textarea */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Feedback (Optional)
                                </label>
                                <Textarea
                                    placeholder="Tell us more about the service..."
                                    className="min-h-[120px] rounded-2xl border-border/40 focus:ring-primary/20 bg-muted/20 resize-none text-sm font-medium"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1 rounded-2xl h-12 text-xs font-black uppercase tracking-widest text-muted-foreground"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-[2] rounded-2xl h-12 text-xs font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    disabled={rating === 0 || isSubmitting}
                                    onClick={handleSubmitRating}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                                    {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
