"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent, MotionValue } from "framer-motion"
import {
    ChevronLeft,
    ChevronRight,
    Monitor,
    Zap,
    Droplets,
    Smartphone,
    Palette,
    ShieldCheck,
    AirVent
} from "lucide-react"
import Link from "next/link"

// =============================================================================
// TYPES
// =============================================================================
type ServiceType = "technician" | "digital"

interface Service {
    id: number
    name: string
    type: ServiceType
    icon: any
    image: string
    accent: string
    description: string
}

// =============================================================================
// DATA
// =============================================================================
const services: Service[] = [
    { id: 1, name: "AC Repair Specialist", type: "technician", icon: AirVent, image: "https://media.istockphoto.com/id/2211719481/photo/technician-with-screwdriver-repairing-air-conditioner-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=jgXsFwah9TmgEV1m6MXRy3_BqpA0V6zJ5q4AkWw4vM4=", accent: "from-blue-500 to-cyan-500", description: "Expert cooling solutions for your home and office." },
    { id: 2, name: "Full Stack Development", type: "digital", icon: Monitor, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80", accent: "from-purple-500 to-indigo-500", description: "Building robust scalable web applications." },
    { id: 3, name: "Master Electrician", type: "technician", icon: Zap, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", accent: "from-amber-500 to-orange-500", description: "Safe and reliable electrical repairs and installations." },
    { id: 4, name: "Mobile App Development", type: "digital", icon: Smartphone, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", accent: "from-emerald-500 to-teal-500", description: "Creating intuitive mobile experiences for iOS and Android." },
    { id: 5, name: "Expert Plumbing", type: "technician", icon: Droplets, image: "https://plus.unsplash.com/premium_photo-1661884973994-d7625e52631a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBsdW1iZXJ8ZW58MHx8MHx8fDA%3D", accent: "from-cyan-500 to-blue-500", description: "Handling all your water and drainage needs." },
    { id: 6, name: "UI/UX Design", type: "digital", icon: Palette, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", accent: "from-pink-500 to-rose-500", description: "Designing beautiful and functional user interfaces." },
    { id: 7, name: "Smart Home Setup", type: "technician", icon: ShieldCheck, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80", accent: "from-violet-500 to-purple-500", description: "Modernizing your living space with IoT excellence." },
    { id: 8, name: "Cybersecurity Analyst", type: "digital", icon: ShieldCheck, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", accent: "from-slate-500 to-gray-600", description: "Protecting your digital assets from emerging threats." }
]

const GAP = 24
const AUTO_SCROLL_INTERVAL = 3500 // Slightly faster for responsiveness
const MULTIPLIER = 5 // Odd number is best for centering

// =============================================================================
// CARD
// =============================================================================
function ServiceCard({
    service,
    cardWidth,
    index,
    scrollX,
    containerWidth
}: {
    service: Service
    cardWidth: number
    index: number
    scrollX: MotionValue<number>
    containerWidth: number
}) {
    const Icon = service.icon

    // Calculate center relative to container
    // Position of card i = i * (cardWidth + GAP)
    // Distance from center = (scrollX + i * (cardWidth + GAP) + cardWidth/2) - containerWidth/2
    const centerX = useTransform(scrollX, (latest) => {
        const cardCenter = latest + index * (cardWidth + GAP) + cardWidth / 2
        return cardCenter - containerWidth / 2
    })

    // Focus effects based on distance from center
    const scale = useTransform(centerX, [-cardWidth, 0, cardWidth], [0.85, 1.12, 0.85])
    const opacity = useTransform(centerX, [-cardWidth, 0, cardWidth], [0.3, 1, 0.3])
    const y = useTransform(centerX, [-cardWidth, 0, cardWidth], [0, -32, 0])
    const shadowOpacity = useTransform(centerX, [-cardWidth, 0, cardWidth], [0.1, 0.45, 0.1])
    const borderAlpha = useTransform(centerX, [-cardWidth, 0, cardWidth], [0.05, 1, 0.05])

    return (
        <motion.div
            style={{
                width: cardWidth,
                scale,
                opacity,
                y,
                padding: "48px 12px"
            }}
            className="flex-shrink-0"
        >
            <Link href="#">
                <motion.div
                    style={{
                        boxShadow: useTransform(shadowOpacity, (v) => `0 20px 60px rgba(59, 130, 246, ${v})`),
                        borderColor: useTransform(borderAlpha, (v) => `rgba(96, 165, 250, ${v})`)
                    }}
                    className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-colors duration-500"
                >
                    <div className="relative h-52 md:h-64 overflow-hidden">
                        <motion.img
                            src={service.image}
                            style={{
                                scale: useTransform(centerX, [-cardWidth, 0, cardWidth], [1.2, 1.05, 1.2]),
                                filter: useTransform(centerX, [-cardWidth, 0, cardWidth], ["grayscale(100%)", "grayscale(0%)", "grayscale(100%)"])
                            }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase text-white bg-blue-600/90 flex gap-2 backdrop-blur-sm">
                            <Icon className="w-4 h-4" /> {service.type}
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{service.name}</h3>
                        <p className="mt-2 text-slate-600 text-sm line-clamp-2">{service.description}</p>

                        <div className="mt-8 flex justify-between items-center">
                            <span className="text-xs tracking-[0.25em] font-black text-blue-600 uppercase">Explore Services</span>
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.accent} flex items-center justify-center text-white shadow-lg`}>
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

// =============================================================================
// SLIDER
// =============================================================================
export function FindServicesSlider() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [cardWidth, setCardWidth] = useState(320)
    const [isDragging, setIsDragging] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const total = services.length
    const extended = useMemo(() => Array(MULTIPLIER).fill(services).flat(), [])

    const centerSet = Math.floor(MULTIPLIER / 2)
    const startIndex = centerSet * total

    // Primary Motion Values
    const scrollX = useMotionValue(0)
    const springProps = { stiffness: 120, damping: 24, mass: 1 }
    const springX = useSpring(scrollX, springProps)

    // Helper: Calculate center offset for a given index
    const getOffsetFor = useCallback((i: number) => {
        if (!containerWidth) return 0
        return containerWidth / 2 - cardWidth / 2 - i * (cardWidth + GAP)
    }, [containerWidth, cardWidth])

    // Layout Management
    useEffect(() => {
        const updateLayout = () => {
            if (!containerRef.current) return
            const w = containerRef.current.offsetWidth
            setContainerWidth(w)

            // Responsive card widths
            const newCardWidth = w < 640 ? w * 0.85 : w < 1024 ? 360 : 400
            setCardWidth(newCardWidth)
        }

        updateLayout()
        const observer = new ResizeObserver(updateLayout)
        observer.observe(containerRef.current!)
        return () => observer.disconnect()
    }, [])

    // Initial Position
    useEffect(() => {
        if (containerWidth === 0) return
        const startPos = getOffsetFor(startIndex)
        scrollX.set(startPos)
        springX.jump(startPos)
    }, [containerWidth, startIndex, getOffsetFor])

    // Infinite Loop & Focus Math
    useMotionValueEvent(scrollX, "change", (latest) => {
        if (!containerWidth) return

        // Calculate theoretical center index
        const index = Math.round((containerWidth / 2 - latest - cardWidth / 2) / (cardWidth + GAP))
        setActiveIndex(index)

        // Seamless Warp Logic
        // We want to stay within the central set [startIndex, startIndex + total - 1]
        const minX = getOffsetFor(startIndex + total)
        const maxX = getOffsetFor(startIndex - total)

        if (latest <= minX) {
            const diff = latest - minX
            const jumpTo = getOffsetFor(startIndex) + diff
            scrollX.set(jumpTo)
            springX.jump(jumpTo)
        } else if (latest >= maxX) {
            const diff = latest - maxX
            const jumpTo = getOffsetFor(startIndex + total - 1) + diff
            scrollX.set(jumpTo)
            springX.jump(jumpTo)
        }
    })

    // Auto Scroll Logic
    useEffect(() => {
        if (isDragging || isHovered) return

        const timer = setInterval(() => {
            const currentX = scrollX.get()
            const currentIndex = Math.round((containerWidth / 2 - currentX - cardWidth / 2) / (cardWidth + GAP))
            const targetX = getOffsetFor(currentIndex + 1)
            scrollX.set(targetX)
        }, AUTO_SCROLL_INTERVAL)

        return () => clearInterval(timer)
    }, [isDragging, isHovered, containerWidth, getOffsetFor, cardWidth])

    const handleDragStart = () => setIsDragging(true)

    const handleDragEnd = (_: any, info: any) => {
        setIsDragging(false)

        // Calculate snap point based on velocity
        const velocity = info.velocity.x
        const currentX = scrollX.get()

        // Find current fractional index
        const fractionalIndex = (containerWidth / 2 - currentX - cardWidth / 2) / (cardWidth + GAP)

        // Adjust for velocity (swipe)
        let targetIndex = Math.round(fractionalIndex)
        if (Math.abs(velocity) > 200) {
            targetIndex = velocity > 0 ? Math.floor(fractionalIndex) : Math.ceil(fractionalIndex)
        }

        const snapX = getOffsetFor(targetIndex)

        // Snap hard to target
        scrollX.set(snapX)
    }

    return (
        <section
            className="py-24 bg-slate-50 overflow-hidden select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4 mb-20 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Explore Our <span className="text-blue-600">Expert Services</span>
                </h2>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-medium">
                    From home maintenance to digital transformation, find the right professional for your needs.
                </p>
            </div>

            <div ref={containerRef} className="relative w-full overflow-visible">
                <motion.div
                    drag="x"
                    dragConstraints={{ left: -10000, right: 10000 }} // Infinite drag
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{ x: springX }}
                    className="flex cursor-grab active:cursor-grabbing items-center"
                >
                    {extended.map((service, i) => (
                        <ServiceCard
                            key={i}
                            index={i}
                            service={service}
                            cardWidth={cardWidth}
                            scrollX={scrollX}
                            containerWidth={containerWidth}
                        />
                    ))}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 md:px-12 pointer-events-none">
                    <button
                        onClick={() => scrollX.set(getOffsetFor(activeIndex - 1))}
                        className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md shadow-xl border border-white flex items-center justify-center text-slate-900 pointer-events-auto hover:bg-blue-600 hover:text-white transition-all duration-300 -translate-x-full lg:translate-x-0"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scrollX.set(getOffsetFor(activeIndex + 1))}
                        className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md shadow-xl border border-white flex items-center justify-center text-slate-900 pointer-events-auto hover:bg-blue-600 hover:text-white transition-all duration-300 translate-x-full lg:translate-x-0"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="mt-16 flex justify-center gap-3">
                {services.map((_, i) => {
                    const normalizedActive = ((activeIndex % total) + total) % total
                    return (
                        <div
                            key={i}
                            className={`h-2 transition-all duration-500 rounded-full ${i === normalizedActive
                                ? "w-10 bg-blue-600"
                                : "w-2 bg-slate-300"
                                }`}
                        />
                    )
                })}
            </div>
        </section>
    )
}