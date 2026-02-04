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
const AUTO_SCROLL_INTERVAL = 2000
const MULTIPLIER = 7

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

    // Distance Calculation relative to center of container
    const distanceProxy = useTransform(scrollX, (latest) => {
        // Center of this card in the X universe
        const cardCenter = latest + (index * (cardWidth + GAP)) + (cardWidth / 2)
        // Container Center
        const containerCenter = containerWidth / 2
        return cardCenter - containerCenter
    })

    const scale = useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [0.9, 1.1, 0.9])
    const opacity = useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [0.55, 1, 0.55])
    const y = useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [0, -32, 0])
    const shadowOpacity = useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [0.1, 0.5, 0.1])
    const borderAlpha = useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [0.1, 1, 0.1])

    return (
        <motion.div
            style={{
                width: cardWidth,
                marginRight: GAP,
                scale,
                opacity,
                y,
                zIndex: useTransform(distanceProxy, (d) => Math.abs(d) < cardWidth / 2 ? 10 : 0)
            }}
            className="flex-shrink-0 py-24 select-none relative"
        >
            <Link href="#" draggable={false} className="block h-full cursor-grab active:cursor-grabbing">
                <motion.div
                    style={{
                        boxShadow: useTransform(shadowOpacity, (v) => `0 25px 60px -10px rgba(59, 130, 246, ${v})`),
                        borderColor: useTransform(borderAlpha, (v) => `rgba(96, 165, 250, ${v})`)
                    }}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 h-full flex flex-col transition-colors duration-300"
                >
                    <div className="relative h-48 md:h-64 overflow-hidden bg-slate-100">
                        <motion.img
                            src={service.image}
                            draggable={false}
                            className="w-full h-full object-cover"
                            style={{
                                scale: useTransform(distanceProxy, [-cardWidth, 0, cardWidth], [1.1, 1, 1.1])
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase text-white bg-blue-600/90 flex gap-2 backdrop-blur-sm border border-white/10">
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" /> {service.type}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2">
                            {service.name}
                        </h3>
                        <p className="text-slate-500 text-xs md:text-sm line-clamp-3 leading-relaxed mb-6">
                            {service.description}
                        </p>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                            <span className="text-[10px] tracking-[0.2em] font-black text-blue-600 uppercase">
                                Explore
                            </span>
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${service.accent} flex items-center justify-center text-white shadow-lg`}>
                                <ChevronRight className="w-5 h-5" />
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
    const [activeIndex, setActiveIndex] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Data Setup
    const total = services.length
    // Duplicate services enough times for smooth warping (Multiplier = 7 is safe)
    const extended = useMemo(() => Array(MULTIPLIER).fill(services).flat(), [])
    const centerSet = Math.floor(MULTIPLIER / 2)
    const startIndex = centerSet * total

    // Motion Setup
    const scrollX = useMotionValue(0)
    const springX = useSpring(scrollX, {
        stiffness: 120,
        damping: 20,
        mass: 1
    })

    // Calculate position for a specific index to be in the center
    const getAnchorPosition = useCallback((index: number) => {
        if (!containerWidth) return 0
        const centerOffset = containerWidth / 2
        const cardHalf = cardWidth / 2
        const cardStart = index * (cardWidth + GAP)
        // Formula derived: x + cardStart + cardHalf = centerOffset -> x = centerOffset - cardHalf - cardStart
        return centerOffset - cardHalf - cardStart
    }, [containerWidth, cardWidth])

    // Layout Observer
    useEffect(() => {
        const updateLayout = () => {
            if (!containerRef.current) return
            const w = containerRef.current.offsetWidth
            setContainerWidth(w)

            // Responsive Card Width
            let newCardWidth
            if (w < 640) {
                newCardWidth = Math.min(w * 0.85, 320)
            } else if (w < 1024) {
                newCardWidth = Math.min(w / 2.5, 360)
            } else {
                newCardWidth = Math.min(w / 3.5, 400)
            }
            setCardWidth(newCardWidth)
        }

        updateLayout()
        const observer = new ResizeObserver(updateLayout)
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    // Recenter on resize
    useEffect(() => {
        // Whenever widths change, jump to the current active index to maintain focus
        if (containerWidth > 0 && cardWidth > 0) {
            const target = getAnchorPosition(activeIndex || startIndex)
            scrollX.set(target)
            springX.jump(target) // Instant jump no anim
        }
    }, [containerWidth, cardWidth, getAnchorPosition, activeIndex, startIndex])

    // --- INFINITE LOOP & STATE SYNC ---
    useMotionValueEvent(springX, "change", (latest) => {
        if (!containerWidth || !cardWidth) return

        const centerOffset = containerWidth / 2
        // Calculate which index is visually in the best center position
        // The formula: (CenterOffset - currentX - CardHalf) / (CardWidth + Gap)
        const exactIndex = (centerOffset - latest - (cardWidth / 2)) / (cardWidth + GAP)
        const safeIndex = Math.round(exactIndex)

        // Normalize for UI (dots)
        setActiveIndex(safeIndex)

        // WARP LOGIC (Keep us in the middle set)
        const minIndex = (centerSet - 1) * total
        const maxIndex = (centerSet + 1) * total - 1

        // Boundaries in pixels
        const minX = getAnchorPosition(maxIndex) // rightmost limit
        const maxX = getAnchorPosition(minIndex) // leftmost limit

        if (latest < minX) {
            const diff = minX - latest
            const warpIndex = safeIndex - total
            const warpPos = getAnchorPosition(warpIndex) - diff
            scrollX.set(warpPos)
            springX.jump(warpPos)
        } else if (latest > maxX) {
            const diff = latest - maxX
            const warpIndex = safeIndex + total
            const warpPos = getAnchorPosition(warpIndex) + diff
            scrollX.set(warpPos)
            springX.jump(warpPos)
        }
    })

    // --- AUTO SCROLL ---
    useEffect(() => {
        if (isDragging || isHovered) return

        const interval = setInterval(() => {
            // Move one index forward
            const nextIndex = activeIndex + 1
            const target = getAnchorPosition(nextIndex)
            scrollX.set(target)
        }, AUTO_SCROLL_INTERVAL)

        return () => clearInterval(interval)
    }, [isDragging, isHovered, activeIndex, getAnchorPosition])

    const handleDragStart = () => setIsDragging(true)

    const handleDragEnd = (_: any, info: any) => {
        setIsDragging(false)
        const velocity = info.velocity.x
        const currentX = springX.get()

        // Predict where we end up
        const centerOffset = containerWidth / 2
        const exactIndex = (centerOffset - currentX - (cardWidth / 2)) / (cardWidth + GAP)

        // Velocity assists the direction
        const direction = velocity < 0 ? 1 : -1 // dragging left means increasing index
        const momentum = Math.abs(velocity) > 200 ? 0.5 * direction : 0

        const targetIndex = Math.round(exactIndex + momentum)
        const targetPos = getAnchorPosition(targetIndex)

        scrollX.set(targetPos)
    }

    return (
        <section
            className="py-24 bg-slate-50 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Find <span className="text-blue-600">Services</span>
                </h2>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-medium">
                    Find the perfect professional for your home and business needs.
                </p>
            </div>

            <div ref={containerRef} className="relative w-full h-[640px] flex items-center overflow-hidden">
                <motion.div
                    className="flex absolute left-0"
                    drag="x"
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{ x: springX, cursor: isDragging ? "grabbing" : "grab" }}
                >
                    {extended.map((s, i) => (
                        <ServiceCard
                            key={i}
                            index={i}
                            service={s}
                            cardWidth={cardWidth}
                            scrollX={springX}
                            containerWidth={containerWidth}
                        />
                    ))}
                </motion.div>

                {/* Nav Buttons */}
                <div className="absolute inset-0 pointer-events-none hidden lg:flex items-center justify-between px-12 max-w-[1400px] mx-auto">
                    <button
                        onClick={() => {
                            const target = getAnchorPosition(activeIndex - 1)
                            scrollX.set(target)
                        }}
                        className="pointer-events-auto w-14 h-14 rounded-full bg-white/80 shadow-2xl backdrop-blur-sm border border-white flex items-center justify-center text-slate-700 hover:scale-110 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => {
                            const target = getAnchorPosition(activeIndex + 1)
                            scrollX.set(target)
                        }}
                        className="pointer-events-auto w-14 h-14 rounded-full bg-white/80 shadow-2xl backdrop-blur-sm border border-white flex items-center justify-center text-slate-700 hover:scale-110 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-4">
                {services.map((_, i) => {
                    // Safe modulo for negative numbers too
                    const normalizedActive = ((activeIndex % total) + total) % total
                    return (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-500 ${i === normalizedActive ? "w-10 bg-blue-600" : "w-2 bg-slate-300"}`}
                        />
                    )
                })}
            </div>
        </section>
    )
}