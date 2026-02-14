"use client"

import React from "react"
import { MiniSlider } from "./mini-slider"
import { Search, MapPin, User, Bell } from "lucide-react"

export const DeviceMockup: React.FC = () => {
    return (
        <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden group">
            {/* Device Inner Border / Screen Glow */}
            <div className="absolute inset-x-0 inset-y-0 rounded-[2.5rem] border border-white/10 pointer-events-none z-30"></div>

            {/* Notch / Camera */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-40 flex items-center justify-center gap-2">
                <div className="w-10 h-1 bg-gray-700 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>

            {/* Screen Content */}
            <div className="w-full h-full bg-[#0a0a0B] flex flex-col relative">
                {/* App Header */}
                <div className="pt-8 px-4 pb-4 bg-secondary/80 backdrop-blur-md border-b border-white/5 z-20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white font-bold text-xs">SB</span>
                            </div>
                            <span className="text-white font-semibold text-sm">SkillBazar</span>
                        </div>
                        <div className="flex gap-3">
                            <Bell className="w-4 h-4 text-gray-400" />
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                        <input
                            disabled
                            placeholder="Search services..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-4 text-[10px] text-gray-400"
                        />
                    </div>
                </div>

                {/* Dynamic Content (Mini Slider) */}
                <div className="flex-grow relative overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center gap-1 text-[10px] text-primary mb-2">
                            <MapPin className="w-3 h-3" />
                            Karachi, Pakistan
                        </div>
                        <h2 className="text-white font-bold text-lg leading-tight mb-4">
                            Find the best experts <br /> for your needs.
                        </h2>
                    </div>

                    <div className="h-2/3 border-y border-white/5">
                        <MiniSlider />
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 mt-4">
                        <div className="h-16 rounded-xl bg-white/5 border border-white/5 animate-pulse"></div>
                        <div className="h-16 rounded-xl bg-white/5 border border-white/5 animate-pulse animation-delay-500"></div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="h-16 border-t border-white/5 bg-secondary/80 backdrop-blur-md flex items-center justify-around px-2 z-20">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-lg ${i === 0 ? "bg-primary/20 text-primary" : "text-gray-500"} flex items-center justify-center`}>
                            <div className="w-5 h-5 bg-current opacity-20 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Screen Reflection */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-40 opacity-30"></div>
        </div>
    )
}
