"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, useAnimation, useMotionValue, useSpring, AnimatePresence, useTransform, MotionValue } from "framer-motion"
import { Star, Code, Wrench, Award, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// =============================================================================
// TYPES
// =============================================================================
type Role = "freelancer" | "technician"

interface BaseProfile {
  id: number
  name: string
  rating: number
  reviews: number
  available: boolean
  verified: boolean
  image: string
  role: Role
  accent: string
}

interface FreelancerProfile extends BaseProfile {
  role: "freelancer"
  skill: string
  skills: string[]
  hourlyRate: number
  successRate: number
}

interface TechnicianProfile extends BaseProfile {
  role: "technician"
  skill: string
  certifications: string[]
  jobsCompleted: number
  serviceRating: number
}

type Profile = FreelancerProfile | TechnicianProfile

// =============================================================================
// UPDATED DUMMY DATA (Male-only Hybrid Model)
// =============================================================================
const profiles: Profile[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    role: "technician",
    skill: "AC Repair Specialist",
    rating: 4.9,
    reviews: 127,
    jobsCompleted: 340,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    certifications: ["EPA 608", "HVAC Level 2"],
    serviceRating: 4.8,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Muhammad Ali",
    role: "freelancer",
    skill: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript"],
    rating: 4.8,
    reviews: 89,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    hourlyRate: 75,
    successRate: 98,
    accent: "from-purple-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Omar Farooq",
    role: "technician",
    skill: "Master Electrician",
    rating: 4.7,
    reviews: 203,
    jobsCompleted: 528,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    certifications: ["Licensed Electrician"],
    serviceRating: 4.9,
    accent: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    name: "Rashid Mehmood",
    role: "freelancer",
    skill: "Mobile App Developer",
    skills: ["React Native", "Flutter", "iOS"],
    rating: 4.9,
    reviews: 67,
    available: false,
    verified: true,
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    hourlyRate: 90,
    successRate: 95,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    name: "Bilal Ahmed",
    role: "technician",
    skill: "Plumbing Expert",
    rating: 4.8,
    reviews: 156,
    jobsCompleted: 412,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    certifications: ["Master Plumber"],
    serviceRating: 4.7,
    accent: "from-cyan-500 to-blue-500",
  },
  {
    id: 6,
    name: "Kashif Nazir",
    role: "freelancer",
    skill: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Branding"],
    rating: 4.7,
    reviews: 98,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop&crop=face",
    hourlyRate: 65,
    successRate: 97,
    accent: "from-pink-500 to-rose-500",
  },
  {
    id: 7,
    name: "Saad Khan",
    role: "technician",
    skill: "Smart Home Installer",
    rating: 4.9,
    reviews: 234,
    jobsCompleted: 567,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    certifications: ["IoT Specialist"],
    serviceRating: 4.8,
    accent: "from-violet-500 to-purple-500",
  },
  {
    id: 8,
    name: "Usman Gill",
    role: "freelancer",
    skill: "Cybersecurity Analyst",
    skills: ["Cloud Security", "Pentesting"],
    rating: 4.8,
    reviews: 78,
    available: true,
    verified: true,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    hourlyRate: 110,
    successRate: 99,
    accent: "from-slate-500 to-gray-600",
  },
]

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
const GAP = 24

// =============================================================================
// PROFILE CARD COMPONENT
// =============================================================================
function ProfileCard({
  profile,
  index,
  cardWidth,
  xValue,
  containerCenter
}: {
  profile: Profile;
  index: number;
  cardWidth: number;
  xValue: MotionValue<number>;
  containerCenter: number
}) {
  const [imageError, setImageError] = useState(false)
  const isFreelancer = profile.role === "freelancer"

  // Continuous Scaling Logic based on position
  const cardX = useTransform(xValue, (v) => v + index * (cardWidth + GAP) + cardWidth / 2)
  const scale = useTransform(cardX, [containerCenter - cardWidth, containerCenter, containerCenter + cardWidth], [0.9, 1.05, 0.9])
  const opacity = useTransform(cardX, [containerCenter - cardWidth, containerCenter, containerCenter + cardWidth], [0.6, 1, 0.6])
  const zIndex = useTransform(cardX, [containerCenter - 2, containerCenter, containerCenter + 2], [10, 20, 10])

  return (
    <motion.div
      style={{ width: cardWidth, scale, opacity, zIndex }}
      className="flex-shrink-0 px-3 py-10 relative"
    >
      <Link href={`/technician/${profile.id}`}>
        <div
          className={`
            relative bg-white rounded-2xl overflow-hidden
            transition-all duration-500 ease-out border border-slate-100 h-full
            shadow-md group active:scale-[0.98]
          `}
        >
          {/* Accent bar */}
          <div className={`h-1.5 bg-gradient-to-r ${profile.accent}`} />

          {/* Role badge */}
          <div className={`
            absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm
            ${isFreelancer ? "bg-indigo-500/90 text-white" : "bg-blue-500/90 text-white"}
          `}>
            {isFreelancer ? <Code className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-bold tracking-wider uppercase">{profile.role}</span>
          </div>

          <div className="p-4 md:p-6">
            {/* Image Section */}
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-5">
              <motion.img
                src={imageError ? FALLBACK_IMAGE : profile.image}
                alt={profile.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                whileHover={{ scale: 1.1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

              {/* Verified Badge */}
              {profile.verified && (
                <div className="absolute top-3 right-3 p-1 bg-white rounded-full shadow-lg">
                  <Award className="w-4 h-4 text-blue-500" />
                </div>
              )}

              {/* Availability */}
              <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md ${profile.available ? "bg-green-500/90 text-white" : "bg-slate-500/90 text-white"
                }`}>
                {profile.available ? "ONLINE" : "BUSY"}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold text-slate-900 truncate pr-2">{profile.name}</h3>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-xs font-bold">{profile.rating}</span>
                </div>
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-500 truncate">{profile.skill}</p>

              {isFreelancer ? (
                <div className="pt-4 mt-4 border-t border-slate-50">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(profile as FreelancerProfile).skills.slice(0, 2).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded uppercase tracking-wide">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rate</p>
                      <p className="text-sm md:text-lg font-black text-slate-900 cursor-default">
                        ${(profile as FreelancerProfile).hourlyRate}<span className="text-xs text-slate-400 font-normal">/hr</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Success</p>
                      <p className="text-xs md:text-sm font-bold text-green-600">{(profile as FreelancerProfile).successRate}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase truncate">{(profile as TechnicianProfile).certifications[0]}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Experience</p>
                      <p className="text-sm md:text-lg font-black text-slate-900 cursor-default">
                        {(profile as TechnicianProfile).jobsCompleted}+ <span className="text-xs text-slate-400 font-normal">Jobs</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Reliability</p>
                      <p className="text-xs md:text-sm font-bold text-blue-600">{(profile as TechnicianProfile).serviceRating}/5.0</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/[0.02] pointer-events-none transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  )
}

// =============================================================================
// MAIN SLIDER COMPONENT
// =============================================================================
export function TechnicianSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Tripling data for seamless loop
  const tripleProfiles = useMemo(() => [...profiles, ...profiles, ...profiles], [])

  const [currentIndex, setCurrentIndex] = useState(profiles.length) // Start from the middle set
  const [isPaused, setIsPaused] = useState(false)

  // Dynamic Responsive State
  const [visibleCount, setVisibleCount] = useState(5)
  const [cardWidth, setCardWidth] = useState(300)
  const [containerCenter, setContainerCenter] = useState(0)

  const x = useMotionValue(-(profiles.length * (cardWidth + GAP)))
  const springX = useSpring(x, { stiffness: 100, damping: 20 })

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      let vc = 5
      let cw = 300

      if (w < 480) {
        vc = 1
        cw = w * 0.75
      } else if (w < 768) {
        vc = 2
        cw = 260
      } else if (w < 1024) {
        vc = 3
        cw = 280
      } else if (w < 1280) {
        vc = 4
        cw = 280
      } else if (w < 1536) {
        vc = 5
        cw = 300
      } else {
        vc = 6
        cw = 300
      }

      setVisibleCount(vc)
      setCardWidth(cw)

      if (containerRef.current) {
        setContainerCenter(containerRef.current.offsetWidth / 2)
      }

      // Update x instantly on resize to keep centering correct
      x.set(-(currentIndex * (cw + GAP)))
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentIndex, x])

  // Continuous Scroll Effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      handleScrollToIndex(currentIndex + 1)
    }, 4000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, cardWidth])

  const handleScrollToIndex = (index: number) => {
    const targetX = -(index * (cardWidth + GAP))
    x.set(targetX)
    setCurrentIndex(index)

    // Infinite loop reset logic
    if (index >= profiles.length * 2) {
      setTimeout(() => {
        const resetIndex = profiles.length
        x.jump(-(resetIndex * (cardWidth + GAP)))
        setCurrentIndex(resetIndex)
      }, 600)
    } else if (index < profiles.length) {
      setTimeout(() => {
        const resetIndex = profiles.length * 2 - 1
        x.jump(-(resetIndex * (cardWidth + GAP)))
        setCurrentIndex(resetIndex)
      }, 600)
    }
  }

  return (
    <section className="py-12 md:py-24 bg-slate-50/50 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16 gap-6 md:gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl px-4"
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Featured Profiles
            </h2>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleScrollToIndex(currentIndex - 1)}
              className="p-3 md:p-4 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScrollToIndex(currentIndex + 1)}
              className="p-3 md:p-4 rounded-full bg-slate-900 border border-slate-800 shadow-xl text-white hover:bg-blue-600 hover:scale-110 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider Track Wrapper */}
        <div
          ref={containerRef}
          className="relative px-4 md:px-[10vw] flex justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            ref={trackRef}
            style={{ x: springX }}
            className="flex cursor-grab active:cursor-grabbing pb-8 md:pb-12"
            drag="x"
            onDrag={(e, info) => {
              // Update x value during drag
              x.set(x.get() + info.delta.x);
            }}
            onDragEnd={(_, info) => {
              const threshold = 50
              if (info.offset.x > threshold) handleScrollToIndex(currentIndex - 1)
              else if (info.offset.x < -threshold) handleScrollToIndex(currentIndex + 1)
              else handleScrollToIndex(currentIndex)
            }}
          >
            {tripleProfiles.map((profile, index) => (
              <ProfileCard
                key={`${profile.id}-${index}`}
                profile={profile}
                index={index}
                cardWidth={cardWidth}
                xValue={springX}
                containerCenter={containerCenter}
              />
            ))}
          </motion.div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1 mt-2">
          {profiles.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${(currentIndex % profiles.length) === i ? "w-6 md:w-8 bg-blue-600" : "w-1.5 md:w-2 bg-slate-200"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,theme(colors.blue.500)_0,transparent_70%)]" />
      </div>
    </section>
  )
}

export default TechnicianSlider
