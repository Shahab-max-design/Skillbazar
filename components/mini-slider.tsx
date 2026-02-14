"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const technicians = [
    { name: "Ali Raza", role: "Electrician", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop" },
    { name: "Hassan Khan", role: "AC Technician", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop" },
    { name: "Sara Ahmed", role: "Web Developer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    { name: "Ayesha Malik", role: "Graphic Designer", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
];

export const MiniSlider: React.FC = () => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % technicians.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="w-32 h-32 rounded-full border-4 border-primary/50 overflow-hidden mb-4 shadow-xl">
                        <img
                            src={technicians[index].image}
                            alt={technicians[index].name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1">{technicians[index].name}</h3>
                    <p className="text-primary font-medium text-sm">{technicians[index].role}</p>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-8">
                {technicians.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-primary" : "w-2 bg-white/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
