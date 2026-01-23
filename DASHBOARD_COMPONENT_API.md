# Customer Dashboard - Component Architecture & API Reference

## 📚 Component Structure

```
app/
├── dashboard/
│   └── customer/
│       ├── page.tsx (Main Dashboard)
│       ├── bookings/
│       ├── messages/
│       ├── favorites/
│       ├── wallet/
│       ├── professional/
│       └── support/
├── technicians/
│   └── page.tsx (Professionals Listing)
└── technician/
    └── [id]/
        └── page.tsx (Professional Detail)

components/
├── quick-categories.tsx (NEW)
├── recent-professionals-section.tsx (NEW)
├── support-section.tsx (NEW)
├── profile-widget.tsx (NEW)
├── dashboard-sidebar.tsx (UPDATED)
└── ui/ (Standard UI components)

hooks/
├── use-recent-professionals.ts (NEW)
├── use-complaints.ts (NEW)
├── use-user.ts (EXISTING)
└── use-toast.ts (EXISTING)
```

---

## 🔧 Component API Reference

### `QuickCategories`
**File**: `components/quick-categories.tsx`

**Props**: None

**Features**:
- Displays 6 category cards
- Each card clickable
- Routes to professionals with filters

**Usage**:
```tsx
import { QuickCategories } from "@/components/quick-categories"

export function MyComponent() {
  return <QuickCategories />
}
```

**Behavior**:
- On category click: `router.push(/technicians?skill={name}&type={type})`
- Shows color-coded badges
- Includes service type info

---

### `RecentProfessionalsSection`
**File**: `components/recent-professionals-section.tsx`

**Props**: None

**Features**:
- Shows recently viewed professionals
- Grid layout (1-3 columns responsive)
- Remove individual entries
- View all button if > 6

**Usage**:
```tsx
import { RecentProfessionalsSection } from "@/components/recent-professionals-section"

export function Dashboard() {
  return <RecentProfessionalsSection />
}
```

**Data Source**: `useRecentProfessionals()` hook

**Behavior**:
- On mount: Loads from localStorage
- On professional click: Routes to `/technician/[id]`
- On remove click: Calls `removeProfessional(id)`

---

### `SupportSection`
**File**: `components/support-section.tsx`

**Props**:
```tsx
interface SupportSectionProps {
  // No props required
}
```

**Features**:
- Live Chat card
- Phone Support card
- Submit Complaint card
- FAQ accordion
- Complaint modal form

**Usage**:
```tsx
import { SupportSection } from "@/components/support-section"

export function Dashboard() {
  return <SupportSection />
}
```

**Behavior**:
- Modal opens on "File Complaint" click
- Form validates on submit
- Success confirmation with animation
- Auto-closes after 2 seconds
- Complaint saved to localStorage

---

### `ProfileWidget`
**File**: `components/profile-widget.tsx`

**Props**:
```tsx
interface ProfileWidgetProps {
  onEditClick?: () => void
}
```

**Features**:
- Profile picture with upload
- User info display
- Profile completion %
- Credits display
- Action buttons
- Quick links

**Usage**:
```tsx
import { ProfileWidget } from "@/components/profile-widget"

export function Sidebar() {
  const handleEdit = () => {
    // Open profile edit dialog
  }
  
  return <ProfileWidget onEditClick={handleEdit} />
}
```

**Behavior**:
- Avatar hover shows upload icon
- File picker on avatar click
- Image validation
- Auto-save to localStorage
- Success toast on upload
- Profile % updates dynamically

---

## 🎣 Hooks API Reference

### `useRecentProfessionals()`
**File**: `hooks/use-recent-professionals.ts`

**Returns**:
```tsx
interface UseRecentProfessionalsReturn {
  professionals: RecentProfessional[]  // Sorted by recent
  addProfessional: (professional: Omit<RecentProfessional, "viewedAt">) => void
  removeProfessional: (id: string) => void
  clearAll: () => void
  isLoading: boolean
}
```

**Types**:
```tsx
interface RecentProfessional {
  id: string
  name: string
  skill: string
  image: string
  rating: number
  reviews: number
  type: "digital" | "onsite"
  viewedAt: number
}
```

**Usage**:
```tsx
import { useRecentProfessionals } from "@/hooks/use-recent-professionals"

export function Component() {
  const { 
    professionals, 
    addProfessional, 
    removeProfessional 
  } = useRecentProfessionals()

  // Add when viewing a professional
  useEffect(() => {
    addProfessional({
      id: "1",
      name: "Ahmed Khan",
      skill: "Electrician",
      image: "https://...",
      rating: 4.9,
      reviews: 127,
      type: "onsite"
    })
  }, [])

  // Remove
  const handleRemove = (id: string) => {
    removeProfessional(id)
  }

  return (
    <div>
      {professionals.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

**Storage Key**: `skillbazaar_recent_professionals`

**Behavior**:
- Loads on mount
- Stores in localStorage
- Limits to 12 entries
- Auto-deduplicates
- Sorted by timestamp DESC

---

### `useComplaints()`
**File**: `hooks/use-complaints.ts`

**Returns**:
```tsx
interface UseComplaintsReturn {
  complaints: Complaint[]
  submitComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "status">) => Complaint
  resolveComplaint: (id: string) => void
  isLoading: boolean
}
```

**Types**:
```tsx
interface Complaint {
  id: string
  subject: string
  description: string
  email: string
  status: "pending" | "resolved"
  createdAt: number
}
```

**Usage**:
```tsx
import { useComplaints } from "@/hooks/use-complaints"

export function ComplaintForm() {
  const { submitComplaint, complaints } = useComplaints()

  const handleSubmit = (data: {subject: string, description: string, email: string}) => {
    const complaint = submitComplaint(data)
    console.log("Complaint ID:", complaint.id)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

**Storage Key**: `skillbazaar_complaints`

**Behavior**:
- Auto-generates ID with timestamp
- Sets status to "pending"
- Records creation time
- Persists to localStorage
- Accessible for future follow-up

---

## 🔀 Data Flow Diagrams

### Recent Professionals Flow
```
User visits /technician/[id]
    ↓
useEffect triggers
    ↓
addProfessional(professional_data)
    ↓
localStorage updated
    ↓
Dashboard loads
    ↓
useRecentProfessionals() reads localStorage
    ↓
RecentProfessionalsSection renders list
```

### Category Filter Flow
```
User clicks category card
    ↓
router.push(/technicians?skill=X&type=Y)
    ↓
TechniciansContent component
    ↓
useSearchParams() reads query params
    ↓
State initialized with filters
    ↓
useEffect applies filters
    ↓
Grid updates with filtered results
```

### Complaint Submission Flow
```
User fills form & clicks submit
    ↓
Form validation
    ↓
submitComplaint(formData)
    ↓
Generate ID & timestamp
    ↓
Set status to "pending"
    ↓
Save to localStorage
    ↓
Return complaint object
    ↓
Show success confirmation
    ↓
Auto-close modal
```

---

## 🎯 Integration Points

### With Existing Components

#### Dashboard Page Integration
```tsx
// app/dashboard/customer/page.tsx
import { QuickCategories } from "@/components/quick-categories"
import { RecentProfessionalsSection } from "@/components/recent-professionals-section"
import { SupportSection } from "@/components/support-section"
import { ProfileWidget } from "@/components/profile-widget"

export default function CustomerDashboardPage() {
  return (
    <div className="lg:ml-64">
      <main>
        <QuickCategories />
        <RecentProfectionalsSection />
        <SupportSection />
      </main>
      {/* Sidebar has ProfileWidget */}
    </div>
  )
}
```

#### Sidebar Integration
```tsx
// components/dashboard-sidebar.tsx
import { ProfileWidget } from "@/components/profile-widget"

export function DashboardSidebar({ type }: DashboardSidebarProps) {
  return (
    <aside>
      {/* Navigation links */}
      {type === "customer" && (
        <ProfileWidget onEditClick={() => {/* ... */}} />
      )}
    </aside>
  )
}
```

#### Technician Detail Integration
```tsx
// app/technician/[id]/page.tsx
import { useRecentProfessionals } from "@/hooks/use-recent-professionals"

export default function TechnicianProfilePage() {
  const { addProfessional } = useRecentProfessionals()

  useEffect(() => {
    if (technician) {
      addProfessional({
        id: technician.id,
        name: technician.name,
        skill: technician.skill,
        image: technician.image,
        rating: technician.rating,
        reviews: technician.reviews,
        type: technician.type,
      })
    }
  }, [technician, addProfessional])

  return (
    <main>
      {/* Profile content */}
    </main>
  )
}
```

---

## 📊 State Management Pattern

### localStorage Structure
```javascript
// skillbazaar_recent_professionals
[
  {
    id: "1",
    name: "Ahmed Khan",
    skill: "Electrician",
    image: "https://...",
    rating: 4.9,
    reviews: 127,
    type: "onsite",
    viewedAt: 1705929600000
  }
]

// skillbazaar_complaints
[
  {
    id: "complaint_1705929600000",
    subject: "Service quality issue",
    description: "Professional was late...",
    email: "user@example.com",
    status: "pending",
    createdAt: 1705929600000
  }
]

// skillbazaar_user (existing)
{
  role: "customer",
  name: "John Doe",
  email: "john@example.com",
  profilePicture: "data:image/...",
  credits: 10,
  // ... other fields
}
```

---

## 🔄 Lifecycle Hooks Usage

### useRecentProfessionals Lifecycle
```
Component Mount
    ↓
useEffect runs
    ↓
Load from localStorage
    ↓
Set isLoading = false
    ↓
Return professionals array
    ↓
Component Render
```

### Profile Upload Lifecycle
```
User clicks avatar
    ↓
File picker opens
    ↓
User selects image
    ↓
onChange handler runs
    ↓
File validation
    ↓
FileReader.readAsDataURL()
    ↓
onload callback
    ↓
updateUser(newData)
    ↓
localStorage updated
    ↓
State updates
    ↓
Component re-renders
    ↓
Toast notification
```

---

## 🧪 Testing Guide

### Unit Testing (useRecentProfessionals)
```tsx
describe("useRecentProfessionals", () => {
  it("should add professional", () => {
    const { result } = renderHook(() => useRecentProfessionals())
    
    act(() => {
      result.current.addProfessional({
        id: "1",
        name: "Test",
        skill: "Dev",
        image: "test.jpg",
        rating: 5,
        reviews: 10,
        type: "digital"
      })
    })

    expect(result.current.professionals).toHaveLength(1)
  })

  it("should persist to localStorage", () => {
    const { result } = renderHook(() => useRecentProfessionals())
    
    act(() => {
      result.current.addProfessional({...professional})
    })

    const stored = JSON.parse(localStorage.getItem("skillbazaar_recent_professionals"))
    expect(stored).toHaveLength(1)
  })
})
```

### Component Testing (QuickCategories)
```tsx
describe("QuickCategories", () => {
  it("should render all 6 categories", () => {
    render(<QuickCategories />)
    expect(screen.getAllByRole("button")).toHaveLength(6)
  })

  it("should navigate on category click", () => {
    const mockPush = jest.fn()
    jest.mock("next/navigation", () => ({
      useRouter: () => ({ push: mockPush })
    }))

    render(<QuickCategories />)
    fireEvent.click(screen.getByText("Web Design"))
    
    expect(mockPush).toHaveBeenCalledWith(
      "/technicians?skill=Web Design&type=digital"
    )
  })
})
```

---

## 🔐 Security Considerations

### localStorage Safety
- ✅ No sensitive data stored (no passwords, tokens)
- ✅ User can clear localStorage anytime
- ✅ Data is URL-encoded (base64 for images)
- ✅ No server transmission of raw localStorage

### Input Validation
- ✅ File type validation (images only)
- ✅ File size validation (< 5MB)
- ✅ Form field validation (non-empty)
- ✅ XSS prevention through React JSX

### Image Handling
- ✅ Only image MIME types accepted
- ✅ Size limited to 5MB
- ✅ Stored as data URL (no external upload)
- ✅ Can be cleared by user

---

## 🚀 Performance Optimization

### Memoization
Components that could benefit from `React.memo()`:
- QuickCategories (static)
- RecentProfessionalsSection (memoizable)
- SupportSection (static)

### Lazy Loading
- Support FAQ could be lazy loaded
- Modal content could be code-split

### localStorage Optimization
- Limit to 12 recent professionals (prevents bloat)
- Cleanup complaints periodically (optional)

---

## 📝 Future Enhancement Hooks

### Backend Integration Point
```tsx
// Hook for backend integration
const useRecentProfessionalsAPI = () => {
  const { data, mutate } = useSWR(
    `/api/recent-professionals`,
    fetcher
  )
  
  return {
    professionals: data,
    addProfessional: (p) => api.post('/recent-professionals', p),
    removeProfessional: (id) => api.delete(`/recent-professionals/${id}`)
  }
}
```

### Notification System
```tsx
// Could integrate with toast notifications
const { addComplaint } = useComplaints()
const { toast } = useToast()

const submit = async () => {
  const complaint = addComplaint(data)
  toast({
    title: "Complaint filed",
    description: `ID: ${complaint.id}`,
    action: <button>Track</button>
  })
}
```

---

**Version**: 1.0.0
**Last Updated**: January 22, 2026
**Status**: Production Ready ✅
