// Subscription utility functions for onsite technicians only

import { TechnicianSubscription } from "./data"

export const getSubscriptionFromStorage = (): TechnicianSubscription | null => {
  try {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem("technicianSubscription")
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading subscription from storage:", error)
    return null
  }
}

export const saveSubscriptionToStorage = (subscription: TechnicianSubscription): void => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem("technicianSubscription", JSON.stringify(subscription))
  } catch (error) {
    console.error("Error saving subscription to storage:", error)
  }
}

export const hasActiveSubscription = (): boolean => {
  const subscription = getSubscriptionFromStorage()
  return subscription !== null && subscription.plan !== undefined
}

// Note: This function is kept for backward compatibility
// Use getUserRole from @/lib/auth instead
export const getUserRole = (): string | null => {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem("userRole")
  } catch {
    return null
  }
}

export const getServiceType = (): string | null => {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem("serviceType")
  } catch {
    return null
  }
}

export const isOnsiteTechnician = (): boolean => {
  const role = getUserRole()
  const serviceType = getServiceType()
  // Support both old and new role formats
  const isOldFormat = role === "service-provider" && serviceType === "onsite"
  const isNewFormat = role === "technician" || role === "onsite_technician"
  return isOldFormat || isNewFormat
}

export const isDigitalProvider = (): boolean => {
  const role = getUserRole()
  const serviceType = getServiceType()
  // Support both old and new role formats
  const isOldFormat = role === "service-provider" && serviceType === "digital"
  const isNewFormat = role === "digital_provider"
  return isOldFormat || isNewFormat
}

export const getRemainingCredits = (): number | "unlimited" => {
  const subscription = getSubscriptionFromStorage()
  if (!subscription) return 0
  const credits = subscription.credits as number | "unlimited"
  return credits === "unlimited" ? "unlimited" : credits
}

export const deductCredit = (): boolean => {
  const subscription = getSubscriptionFromStorage()
  if (!subscription) return false

  const credits = subscription.credits as number | "unlimited"
  if (credits === "unlimited" || typeof credits !== "number") {
    return true
  }

  if (credits > 0) {
    subscription.credits = credits - 1 as any
    saveSubscriptionToStorage(subscription)
    return true
  }

  return false
}

export const canAcceptRequest = (): boolean => {
  if (!isOnsiteTechnician()) {
    // Digital providers don't have credit restrictions
    return true
  }

  const credits = getRemainingCredits()
  return credits === "unlimited" || (typeof credits === "number" && credits > 0)
}
