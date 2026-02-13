"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Hide splash screen after 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f3fbf] w-full h-full"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-48 h-48 md:w-64 md:h-64"
                    >
                        <Image
                            src="/icons/splash.png"
                            alt="SkillBazar Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
