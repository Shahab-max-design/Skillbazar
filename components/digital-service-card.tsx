"use client"

import { Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface DigitalServiceProps {
    id: string
    providerName: string
    providerAvatar?: string
    serviceTitle: string
    description: string
    startingPrice: number
    deliveryTime: string
    rating: number
    reviews: number
    image?: string
    onOrderClick: () => void
}

export function DigitalServiceCard({
    providerName,
    providerAvatar,
    serviceTitle,
    description,
    startingPrice,
    deliveryTime,
    rating,
    reviews,
    image,
    onOrderClick,
}: DigitalServiceProps) {
    return (
        <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50">
            {/* Cover Image */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                    src={image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"}
                    alt={serviceTitle}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600 font-medium border-none shadow-md">
                        Digital Service
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2 space-y-2">
                {/* Provider Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={providerAvatar} />
                        <AvatarFallback>{providerName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground truncate">{providerName}</span>
                </div>

                {/* Service Title */}
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
                    {serviceTitle}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{rating}</span>
                    <span className="text-muted-foreground text-sm">({reviews})</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-2" title={description}>
                    {description}
                </p>
            </CardContent>

            <CardFooter className="p-4 border-t bg-muted/20 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{deliveryTime}</span>
                    </div>
                    <div className="font-semibold text-base whitespace-nowrap">
                        <span className="text-xs font-normal text-muted-foreground mr-1">Starting at</span>
                        PKR {startingPrice.toLocaleString()}
                    </div>
                </div>

                <Button
                    className="w-full font-medium"
                    onClick={onOrderClick}
                >
                    Order Now
                </Button>
            </CardFooter>
        </Card>
    )
}
