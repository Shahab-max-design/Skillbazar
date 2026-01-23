"use client"

import { useState, useEffect } from "react"

export interface UserData {
  role: "service-provider" | "digital_provider" | "technician" | "onsite_technician" | "customer" | null
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

export interface ServiceRequest {
  id: string
  customerId: string
  serviceType: "digital" | "onsite"
  serviceCategory: string
  description: string
  area?: string
  providerName?: string
  status: "pending" | "accepted" | "completed" | "cancelled"
  createdAt: string
}

export interface Complaint {
  id: string
  customerId: string
  subject: string
  description: string
  status: "pending" | "resolved"
  createdAt: string
}

const STORAGE_KEY = "skillbazaar_user"
const STORAGE_KEY_LOGGED_IN = "skillbazaar_logged_in"
const USERS_STORAGE_KEY = "skillbazaar_users"
const REQUESTS_STORAGE_KEY = "skillbazaar_customer_requests"
const COMPLAINTS_STORAGE_KEY = "skillbazaar_complaints"

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
        role: "customer",
        serviceType: undefined,
        name: "Fatima Ahmed",
        email: "customer@example.com",
        phone: "+92 300 1111111",
        password: "customer123",
        profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        credits: 10,
        isLoggedIn: false,
      },
      {
        role: "technician",
        serviceType: "onsite",
        name: "Ahmed Khan",
        email: "technician@example.com",
        phone: "+92 300 2222222",
        password: "technician123",
        profilePicture: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop&crop=face",
        area: "DHA",
        onsiteServices: ["Electrician"],
        credits: 10,
        isLoggedIn: false,
      },
      {
        role: "digital_provider",
        serviceType: "digital",
        name: "Ali Hassan",
        email: "digital@example.com",
        phone: "+92 300 3333333",
        password: "digital123",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        digitalSkills: ["Web Development", "UI/UX Design"],
        portfolioLink: "https://portfolio.example.com",
        hourlyRate: 50,
        availability: "Full-time",
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
    console.log("Available users:", users.map((u: any) => ({ email: u.email, role: u.role })));
    console.log("Attempting to login with:", { email, password });
    
    const foundUser = users.find((u: UserData) => u.email === email && u.password === password)
    console.log("Found user:", foundUser);
    
    if (foundUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser))
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, "true")
      setUser(foundUser)
      console.log("Login successful");
      return true
    }
    console.log("Login failed - user not found");
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

  const createServiceRequest = (request: Omit<ServiceRequest, "id" | "createdAt">) => {
    if (!user) return
    const newRequest: ServiceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    const requests = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]")
    requests.push(newRequest)
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests))
    return newRequest
  }

  const getServiceRequests = (): ServiceRequest[] => {
    if (!user) return []
    const requests = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]")
    return requests.filter((req: ServiceRequest) => req.customerId === user.email)
  }

  const createComplaint = (subject: string, description: string) => {
    if (!user) return
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      customerId: user.email,
      subject,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]")
    complaints.push(newComplaint)
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints))
    return newComplaint
  }

  const getComplaints = (): Complaint[] => {
    if (!user) return []
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_STORAGE_KEY) || "[]")
    return complaints.filter((complaint: Complaint) => complaint.customerId === user.email)
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
    createServiceRequest,
    getServiceRequests,
    createComplaint,
    getComplaints,
  }
}