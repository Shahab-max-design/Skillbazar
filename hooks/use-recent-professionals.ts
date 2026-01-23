"use client"

import { useState, useEffect } from "react"

export interface RecentProfessional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  reviews: number
  type: "digital" | "onsite"
  viewedAt: number
}

const STORAGE_KEY = "skillbazaar_recent_professionals"

export function useRecentProfessionals() {
  const [professionals, setProfessionals] = useState<RecentProfessional[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setProfessionals(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load recent professionals:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addProfessional = (professional: Omit<RecentProfessional, "viewedAt">) => {
    setProfessionals((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== professional.id)
      // Add new at the beginning with current timestamp
      const updated = [{ ...professional, viewedAt: Date.now() }, ...filtered].slice(0, 12) // Keep last 12
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeProfessional = (id: string) => {
    setProfessionals((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearAll = () => {
    setProfessionals([])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Sort by most recently viewed
  const sorted = [...professionals].sort((a, b) => b.viewedAt - a.viewedAt)

  return {
    professionals: sorted,
    addProfessional,
    removeProfessional,
    clearAll,
    isLoading,
  }
}
