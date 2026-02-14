"use client"

import React, { useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Briefcase, Star, Headset } from "lucide-react"

interface StatCardProps {
    icon: React.ElementType
    value: number
    suffix?: string
    decimals?: number
    label: string
    delay: number
}

const AnimatedCounter = ({ value, duration = 2, decimals = 0, suffix = "" }: { value: number; duration?: number; decimals?: number; suffix?: string }) => {
    const [count, setCount] = useState(0)
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const startTime = performance.now()

            const updateCount = (currentTime: number) => {
                const elapsed = (currentTime - startTime) / 1000
                const progress = Math.min(elapsed / duration, 1)

                // Ease out expo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

                const currentCount = start + (end - start) * easeProgress
                setCount(currentCount)

                if (progress < 1) {
                    requestAnimationFrame(updateCount)
                }
            }

            requestAnimationFrame(updateCount)
        }
    }, [isInView, value, duration])

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    )
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, suffix = "", decimals = 0, label, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, translateY: -5 }}
            className="group relative bg-[#0a0a0b] border border-white/5 rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center space-y-4 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-2xl" />
            </div>

            {/* Icon Wrapper */}
            <div className="relative p-4 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors duration-300">
                <Icon className="w-8 h-8 text-primary animate-pulse-slow group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Value */}
            <h3 className="text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
            </h3>

            {/* Label */}
            <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                {label}
            </p>

            {/* Subtle bottom accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500 group-hover:w-1/3" />
        </motion.div>
    )
}

export const StatsSection: React.FC = () => {
    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        icon={Briefcase}
                        value={50000}
                        suffix="+"
                        label="Successful Gigs"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Star}
                        value={4.9}
                        decimals={1}
                        suffix="/5"
                        label="Client Rating"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Headset}
                        value={24}
                        suffix="/7"
                        label="Live Support"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    )
}
