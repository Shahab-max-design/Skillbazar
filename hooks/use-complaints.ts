"use client"

import { useState, useEffect } from "react"

export interface Complaint {
  id: string
  subject: string
  description: string
  email: string
  status: "pending" | "resolved"
  createdAt: number
}

const STORAGE_KEY = "skillbazaar_complaints"

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setComplaints(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load complaints:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitComplaint = (complaint: Omit<Complaint, "id" | "createdAt" | "status">) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: `complaint_${Date.now()}`,
      status: "pending",
      createdAt: Date.now(),
    }
    setComplaints((prev) => {
      const updated = [newComplaint, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    return newComplaint
  }

  const resolveComplaint = (id: string) => {
    setComplaints((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status: "resolved" as const } : c))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return {
    complaints,
    submitComplaint,
    resolveComplaint,
    isLoading,
  }
}
