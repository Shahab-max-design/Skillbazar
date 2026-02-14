"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Search, MapPin, ChevronDown, Star, Shield, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeviceMockup } from "./device-mockup"
import { karachiAreas, services } from "@/lib/data"

export const ProfessionalHero: React.FC = () => {
    const router = useRouter()
    const heroRef = useRef<HTMLDivElement>(null)
    const mockupRef = useRef<HTMLDivElement>(null)
    const shapesRef = useRef<HTMLDivElement>(null)

    // Search State
    const [selectedArea, setSelectedArea] = useState("All Areas")
    const [selectedService, setSelectedService] = useState("All Services")
    const [areaOpen, setAreaOpen] = useState(false)
    const [serviceOpen, setServiceOpen] = useState(false)
    const areaRef = useRef<HTMLDivElement>(null)
    const serviceRef = useRef<HTMLDivElement>(null)

    // GSAP Animations
    useEffect(() => {
        // Floating Animation
        gsap.to(mockupRef.current, {
            y: "-=30",
            x: "+=10",
            rotationZ: "+=2",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        // Mouse Parallax Logic (Desktop Only)
        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 1024) return

            const { clientX, clientY } = e
            const xPos = (clientX / window.innerWidth - 0.5)
            const yPos = (clientY / window.innerHeight - 0.5)

            // Tilt Device
            gsap.to(mockupRef.current, {
                rotationY: xPos * 25,
                rotationX: -yPos * 25,
                duration: 1.2,
                ease: "power2.out"
            })

            // Move Background Shapes
            if (shapesRef.current) {
                gsap.to(shapesRef.current.children, {
                    x: (i) => xPos * (50 + i * 20),
                    y: (i) => yPos * (50 + i * 20),
                    duration: 2,
                    ease: "power3.out"
                })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            gsap.killTweensOf("*")
        }
    }, [])

    // Dropdown Handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
                setAreaOpen(false)
            }
            if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
                setServiceOpen(false)
            }
        }

        if (areaOpen || serviceOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [areaOpen, serviceOpen])

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (selectedArea !== "All Areas") params.set("area", selectedArea)
        if (selectedService !== "All Services") params.set("service", selectedService)
        router.push(`/technicians?${params.toString()}`)
    }

    return (
        <section
            ref={heroRef}
            className="relative z-[100] min-h-screen w-full flex flex-col items-center justify-center overflow-visible bg-[#050505] pt-28 pb-20"
        >
            {/* Background Abstract Shapes */}
            <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-0 overflow-visible">
                <div className="absolute top-[10%] left-[15%] w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[20%] w-80 md:w-[500px] h-80 md:h-[500px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px]"></div>
                <div className="absolute top-[40%] right-[10%] w-48 md:w-64 h-48 md:h-64 bg-purple-600/15 rounded-full blur-[70px] md:blur-[100px]"></div>
            </div>

            <div className="relative z-[110] max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center overflow-visible">

                {/* Left Column: Content */}
                <div className="flex flex-col space-y-6 md:space-y-8 w-full overflow-visible">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                        The Smarter Way <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
                            to Hire Professionals
                        </span>
                    </h1>

                    <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed">
                        Revolutionizing how users connect with top-tier technicians and digital experts. Secure, verified, and instant.
                    </p>

                    {/* Integrated Search Box - Full Width on Mobile */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 relative z-[200] w-full shadow-2xl overflow-visible">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-visible">
                            {/* Area Dropdown */}
                            <div className="relative" ref={areaRef}>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Select Area</label>
                                <button
                                    onClick={() => {
                                        setAreaOpen(!areaOpen)
                                        setServiceOpen(false)
                                    }}
                                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <span className="flex items-center gap-2 text-sm truncate">
                                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                                        {selectedArea}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${areaOpen ? "rotate-180" : ""}`} />
                                </button>
                                {areaOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-xl shadow-2xl border border-white/10 max-h-60 overflow-y-auto min-w-full w-max sm:w-full z-[9999] scroll-smooth">
                                        <div className="py-1">
                                            {karachiAreas.map((area) => (
                                                <button
                                                    key={area}
                                                    onClick={() => {
                                                        setSelectedArea(area)
                                                        setAreaOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-primary/20 transition-colors text-gray-300 text-sm"
                                                >
                                                    {area}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Service Dropdown */}
                            <div className="relative" ref={serviceRef}>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Select Service</label>
                                <button
                                    onClick={() => {
                                        setServiceOpen(!serviceOpen)
                                        setAreaOpen(false)
                                    }}
                                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <span className="flex items-center gap-2 text-sm truncate">
                                        <Search className="w-4 h-4 text-primary shrink-0" />
                                        {selectedService}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${serviceOpen ? "rotate-180" : ""}`} />
                                </button>
                                {serviceOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-xl shadow-2xl border border-white/10 max-h-60 overflow-y-auto min-w-full w-max sm:w-full z-[9999] scroll-smooth">
                                        <div className="py-1">
                                            {services.map((service) => (
                                                <button
                                                    key={service}
                                                    onClick={() => {
                                                        setSelectedService(service)
                                                        setServiceOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-primary/20 transition-colors text-gray-300 text-sm"
                                                >
                                                    {service}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <Button
                                    onClick={handleSearch}
                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 text-base font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                >
                                    <Search className="w-5 h-5 mr-2" />
                                    Find Pro
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* The stats section previously here has been moved to its own component */}
                </div>

                {/* Right Column: Device Mockup - Hidden/Small on Mobile */}
                <div className="flex items-center justify-center lg:justify-end perspective-[2000px] w-full pt-10 lg:pt-0">
                    <div
                        ref={mockupRef}
                        className="relative preserve-3d scale-75 sm:scale-90 lg:scale-100"
                    >
                        {/* Soft Glow behind device */}
                        <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[60px] opacity-50"></div>

                        <DeviceMockup />

                        {/* Floating Badges - Hidden on super small screens */}
                        <div className="hidden sm:block absolute -left-12 top-1/4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-white text-xs font-bold whitespace-nowrap">Verified Pro</div>
                                    <div className="text-gray-400 text-[10px]">Security Guaranteed</div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block absolute -right-8 bottom-1/4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl animate-bounce-slow animation-delay-1000">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <div className="text-white text-xs font-bold whitespace-nowrap">5.0 Rating</div>
                                    <div className="text-gray-400 text-[10px]">Top Rated Experts</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Gradient overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0B] to-transparent z-40 pointer-events-none"></div>
        </section>
    )
}
