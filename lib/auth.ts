/**
 * Role-Based Authentication Utilities
 * Single source of truth for roles and user role management
 */

export type UserRole = "digital_provider" | "technician" | "customer" | null;
export type ServiceType = "digital" | "onsite" | undefined;

const ROLE_STORAGE_KEY = "userRole";
const USER_STORAGE_KEY = "skillbazaar_user";

/**
 * Get the current user's role from localStorage
 * Checks both the direct role storage and the user object
 */
export function getUserRole(): UserRole {
  if (typeof window === "undefined") return null;

  // Try to get role directly from role storage
  const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
  console.log("getUserRole - storedRole from ROLE_STORAGE_KEY:", storedRole);
  if (storedRole) {
    console.log("✅ Using stored role:", storedRole);
    return storedRole as UserRole;
  }

  // Fall back to checking user object
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    console.log("getUserRole - user object found:", !!userStr);
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("Parsed user object:", user);
      if (user.role) {
        console.log("✅ Using role from user object:", user.role);
        return user.role as UserRole;
      }
      // Legacy support: convert old "service-provider" + serviceType to new roles
      if (user.role === "service-provider") {
        console.log("Converting legacy service-provider role. serviceType:", user.serviceType);
        if (user.serviceType === "digital") {
          console.log("✅ Legacy digital provider detected");
          return "digital_provider";
        } else if (user.serviceType === "onsite") {
          console.log("✅ Legacy onsite technician detected");
          return "technician";
        }
      }
      // Legacy support: convert old "onsite_technician" to "technician"
      if (user.role === "onsite_technician") {
        console.log("Converting legacy onsite_technician to technician");
        return "technician";
      }
    }
  } catch (error) {
    console.error("Failed to get user role:", error);
  }

  console.log("❌ No role found");
  return null;
}

/**
 * Save the user's role to localStorage
 */
export function setUserRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  
  if (role) {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } else {
    localStorage.removeItem(ROLE_STORAGE_KEY);
  }
}

/**
 * Check if user is a digital service provider
 */
export function isDigitalProvider(): boolean {
  return getUserRole() === "digital_provider";
}

/**
 * Check if user is a technician
 */
export function isTechnician(): boolean {
  return getUserRole() === "technician";
}

/**
 * Legacy function name - kept for backward compatibility
 */
export function isOnsiteTechnician(): boolean {
  return getUserRole() === "technician";
}

/**
 * Check if user is a customer
 */
export function isCustomer(): boolean {
  return getUserRole() === "customer";
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getUserRole() !== null;
}

/**
 * Get the appropriate dashboard path for a user's role
 */
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "digital_provider":
      return "/dashboard/digital";
    case "technician":
      return "/dashboard/technician";
    case "customer":
      return "/dashboard/customer";
    default:
      return "/";
  }
}

/**
 * Check if user can access a specific dashboard
 */
export function canAccessDashboard(dashboardPath: string, role: UserRole): boolean {
  switch (dashboardPath) {
    case "/dashboard/digital":
      return role === "digital_provider";
    case "/dashboard/technician":
      return role === "technician";
    case "/dashboard/customer":
      return role === "customer";
    default:
      return false;
  }
}
