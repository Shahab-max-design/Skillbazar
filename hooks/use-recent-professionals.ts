"use client"

import { useState, useEffect, useCallback } from "react"

export interface RecentProfessional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  reviews: number
  type?: "digital" | "onsite"
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
      // Fallback or clear if corrupted
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Use useCallback to ensure stable reference
  const addProfessional = useCallback((professional: Omit<RecentProfessional, "viewedAt">) => {
    setProfessionals((prev) => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter((p) => p.id !== professional.id)

      // Add new at the beginning with current timestamp
      const updated = [{ ...professional, viewedAt: Date.now() }, ...filtered].slice(0, 12) // Keep last 12

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save to localStorage", e)
      }

      return updated
    })
  }, [])

  const removeProfessional = useCallback((id: string) => {
    setProfessionals((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setProfessionals([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Sort by most recently viewed (derived state, cheap to compute)
  const sorted = [...professionals].sort((a, b) => b.viewedAt - a.viewedAt)

  return {
    professionals: sorted,
    addProfessional,
    removeProfessional,
    clearAll,
    isLoading,
  }
}
