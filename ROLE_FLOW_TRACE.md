# Role-Based Redirect - Complete Flow Trace

## Scenario: Digital Provider Login

### Step 1: Sign-In Page
**File:** `/app/auth/signin/page.tsx`

```typescript
// User enters: digital@example.com / digital123
// Click Submit

const handleSubmit = async (e: React.FormEvent) => {
  // ...validation...
  
  // Step 1a: Call loginUser()
  const success = loginUser(formData.email, formData.password)
  
  if (success) {
    // Step 1b: Get user from localStorage
    const user = JSON.parse(localStorage.getItem("skillbazaar_user"))
    // user = {
    //   role: "digital_provider",
    //   email: "digital@example.com",
    //   name: "Ali Hassan",
    //   ...
    // }
    
    // Step 1c: Extract role
    let userRole = null
    if (user.role === "digital_provider") {
      userRole = "digital_provider" ✅
    }
    
    // Step 1d: Save role for later access
    setUserRole(userRole)
    // localStorage.setItem("skillbazaar_user_role", "digital_provider")
    
    // Step 1e: Hard redirect to home
    window.location.href = "/"
    // This causes full page reload, ensuring new storage is available
  }
}
```

### Step 2: Home Page useEffect
**File:** `/app/page.tsx`

```typescript
useEffect(() => {
  // Step 2a: Check if user is authenticated
  const isLoggedIn = localStorage.getItem("skillbazaar_logged_in")
  // "true" ✅
  
  if (isLoggedIn) {
    // Step 2b: Get user role
    const role = getUserRole()
    
    // getUserRole() does:
    // 1. Check localStorage.getItem("skillbazaar_user_role")
    // 2. Returns "digital_provider" ✅
    
    console.log("HomePage - User logged in, role:", role)
    // Logs: "HomePage - User logged in, role: digital_provider"
    
    if (role) {
      // Step 2c: Get dashboard path for this role
      const dashboardPath = getDashboardPath(role)
      
      // getDashboardPath("digital_provider") returns "/dashboard/digital" ✅
      
      console.log("HomePage - Redirecting to:", dashboardPath)
      // Logs: "HomePage - Redirecting to: /dashboard/digital"
      
      if (dashboardPath !== "/") {
        // Step 2d: Redirect to dashboard
        router.replace(dashboardPath)
        // Navigates to /dashboard/digital ✅
      }
    }
  }
}, [router])
```

### Step 3: Dashboard Layout Protection
**File:** `/app/dashboard/layout.tsx`

```typescript
useEffect(() => {
  const role = getUserRole()
  // "digital_provider" ✅
  
  const pathname = "/dashboard/digital"
  
  // Check access rules
  if (pathname.startsWith("/dashboard/technician") && role !== "onsite_technician") {
    // NOT executed (pathname is /dashboard/digital)
  }
  
  if (pathname.startsWith("/dashboard/digital") && role !== "digital_provider") {
    // NOT executed (role IS "digital_provider") ✅
  }
  
  // Access granted
  console.log("✅ Access granted for role:", role)
}, [pathname, router])
```

### Step 4: Dashboard Renders
**File:** `/app/dashboard/digital/page.tsx`

```typescript
export default function DigitalDashboardPage() {
  const { user } = useUser()
  // user = {
  //   role: "digital_provider",
  //   email: "digital@example.com",
  //   ...
  // }
  
  return (
    <div>
      <DashboardSidebar type="digital" />
      {/* Renders digital sidebar with:
          - Dashboard Home
          - My Gigs
          - Orders
          - Earnings
          - Messages
          - Reviews
          - Profile
          - Settings
      */}
      <DashboardContent />
    </div>
  )
}
```

---

## Scenario: Technician Attempts Cross-Role Access

### Setup
- User is logged in as digital_provider
- Manually navigates to `/dashboard/technician`

### Step 1: URL Changes
```
Current URL: http://localhost:3000/dashboard/digital
User action: Manually type http://localhost:3000/dashboard/technician
New URL: http://localhost:3000/dashboard/technician
```

### Step 2: Layout Guard Activates
**File:** `/app/dashboard/layout.tsx`

```typescript
useEffect(() => {
  const role = getUserRole()
  // "digital_provider" ✅ (unchanged)
  
  const pathname = "/dashboard/technician"
  // (new pathname from URL)
  
  // Check access rules
  if (pathname.startsWith("/dashboard/technician") && role !== "onsite_technician") {
    // This condition IS TRUE! ⚠️
    // pathname.startsWith("/dashboard/technician") = TRUE
    // role !== "onsite_technician" = TRUE (role is "digital_provider")
    
    console.log("❌ Access denied: Trying to access technician dashboard with role:", role)
    router.replace("/unauthorized") ✅
    return
  }
}, [pathname, router])
```

### Step 3: User Redirected to Unauthorized
```
New URL: http://localhost:3000/unauthorized
Display: 401 Unauthorized page
```

---

## Scenario: Logout and Re-login as Different Role

### Step 1: Logout
**File:** `/components/navbar.tsx`

```typescript
const handleLogout = () => {
  console.log("Signing out - clearing all auth state")
  
  // Clear all auth data
  localStorage.removeItem("skillbazaar_logged_in")
  localStorage.removeItem("skillbazaar_user")
  localStorage.removeItem("skillbazaar_user_role")
  // All auth tokens cleared ✅
  
  setIsAuthenticated(false)
  router.push("/")
  // Redirect to home
}
```

### Step 2: Home Page (No User)
**File:** `/app/page.tsx`

```typescript
useEffect(() => {
  const isLoggedIn = localStorage.getItem("skillbazaar_logged_in")
  // null (cleared by logout) ❌
  
  if (isLoggedIn) {
    // NOT executed (isLoggedIn is null)
  }
  // Home page stays visible
}, [router])
```

### Step 3: Sign In as Technician
**File:** `/app/auth/signin/page.tsx`

```typescript
// Email: technician@example.com
// Password: technician123

const success = loginUser(formData.email, formData.password)
const user = JSON.parse(localStorage.getItem("skillbazaar_user"))
// user.role = "onsite_technician" ✅

let userRole = null
if (user.role === "onsite_technician") {
  userRole = "onsite_technician" ✅
}

setUserRole(userRole)
// localStorage.setItem("skillbazaar_user_role", "onsite_technician")

window.location.href = "/"
```

### Step 4: Home Page (New Role)
**File:** `/app/page.tsx`

```typescript
useEffect(() => {
  const isLoggedIn = localStorage.getItem("skillbazaar_logged_in")
  // "true" ✅
  
  if (isLoggedIn) {
    const role = getUserRole()
    // localStorage.getItem("skillbazaar_user_role") = "onsite_technician" ✅
    // Returns: "onsite_technician"
    
    const dashboardPath = getDashboardPath(role)
    // getDashboardPath("onsite_technician") = "/dashboard/technician" ✅
    
    router.replace(dashboardPath)
    // Redirects to /dashboard/technician ✅
  }
}, [router])
```

### Step 5: Dashboard Renders (Technician)
- User now sees technician dashboard
- Technician sidebar displayed
- Digital provider sidebar NOT displayed ✅

---

## Key Validation Points

### ✅ Correct Role Storage
- Sign-in extracts from `user.role`
- Saves via `localStorage.setItem("skillbazaar_user_role", role)`
- No variations like "digital" or "provider"

### ✅ Role Retrieval
- `getUserRole()` reads exact string from storage
- Returns "digital_provider", "onsite_technician", or "customer"
- No fallbacks to technician

### ✅ Dashboard Mapping
```
"digital_provider" → /dashboard/digital
"onsite_technician" → /dashboard/technician
"customer" → /dashboard/customer
```

### ✅ Cross-Role Protection
- Layout guard checks pathname vs role
- Redirects unauthorized access to /unauthorized
- No exceptions or fallbacks

### ✅ No Technician Default
- If role is invalid, getDashboardPath() returns "/"
- Home page stays visible
- NO automatic technician dashboard redirect

---

## Edge Cases Handled

### 1. Corrupted Role Storage
```javascript
localStorage.setItem("skillbazaar_user_role", "invalid_role")
```
Result: getDashboardPath("invalid_role") returns "/" → Stay on home page ✅

### 2. Missing Role After Login
```javascript
// loginUser succeeds but role extraction fails
// userRole becomes null
setUserRole(null)
```
Result: getUserRole() returns null → No redirect → Home page visible ✅

### 3. Browser Tab Closes During Login
```javascript
// Hard redirect window.location.href = "/"
// Browser window closes before page loads
```
Result: On reopening, localStorage still has auth data → Re-executes home useEffect → Redirects correctly ✅

### 4. Multiple Tabs/Windows
```javascript
// Open in Tab 1: logged in as digital
// Open Tab 2: click sign in as technician
// Tab 2 completes login first
```
Result: Each tab reads its own URL + localStorage → Each redirects correctly ✅
