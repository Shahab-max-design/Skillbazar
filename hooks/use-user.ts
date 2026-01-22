"use client"

import { useState, useEffect } from "react"

export interface UserData {
  role: "service-provider" | "customer" | null
  serviceType?: "onsite" | "digital"
  name: string
  email: string
  phone: string
  password: string
  profilePicture?: string
  // For Service Providers
  area?: string
  onsiteServices?: string[]
  digitalSkills?: string[]
  portfolioLink?: string
  hourlyRate?: number
  availability?: string
  // Credits system
  credits: number
  // Authentication
  isLoggedIn?: boolean
}

const STORAGE_KEY = "skillbazaar_user"
const STORAGE_KEY_LOGGED_IN = "skillbazaar_logged_in"
const USERS_STORAGE_KEY = "skillbazaar_users"

const DEFAULT_USER_DATA: UserData = {
  role: null,
  name: "",
  email: "",
  phone: "",
  password: "",
  credits: 10,
  isLoggedIn: false,
}

// Initialize with demo user
export function initializeDemoUser() {
  if (typeof window === "undefined") return
  
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  if (!users) {
    const defaultUsers: UserData[] = [
      {
        role: "service-provider",
        serviceType: "onsite",
        name: "Ahmed Khan",
        email: "test@example.com",
        phone: "+92 300 1234567",
        password: "test123",
        profilePicture: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop&crop=face",
        area: "DHA",
        onsiteServices: ["Electrician"],
        credits: 10,
        isLoggedIn: false,
      },
    ]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers))
  }
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    initializeDemoUser()
    
    const isLoggedIn = localStorage.getItem(STORAGE_KEY_LOGGED_IN) === "true"
    const storedUser = localStorage.getItem(STORAGE_KEY)
    
    if (isLoggedIn && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  const createUser = (userData: UserData) => {
    // Store user account (DO NOT auto-login)
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    users.push(userData)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    
    // Clear login status
    localStorage.removeItem(STORAGE_KEY_LOGGED_IN)
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const loginUser = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    const foundUser = users.find((u: UserData) => u.email === email && u.password === password)
    
    if (foundUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser))
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, "true")
      setUser(foundUser)
      return true
    }
    return false
  }

  const saveUser = (userData: UserData) => {
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  }

  const updateUser = (updates: Partial<UserData>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates } as UserData
    saveUser(updatedUser)
    
    // Also update in users list
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]")
    const index = users.findIndex((u: UserData) => u.email === user.email)
    if (index >= 0) {
      users[index] = updatedUser
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }
  }

  const deductCredits = (amount: number = 1) => {
    if (user) {
      const newCredits = Math.max(0, user.credits - amount)
      updateUser({ credits: newCredits })
      return newCredits
    }
    return 0
  }

  const clearUser = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY_LOGGED_IN)
  }

  const logoutUser = () => {
    clearUser()
  }

  return {
    user,
    isLoading,
    createUser,
    loginUser,
    saveUser,
    updateUser,
    deductCredits,
    clearUser,
    logoutUser,
  }
}
