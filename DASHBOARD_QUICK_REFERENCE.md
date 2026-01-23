# Customer Dashboard - Developer Quick Reference

## 🚀 Quick Start

```bash
# Start development
npm run dev

# Access dashboard
http://localhost:3000/dashboard/customer
```

---

## 📦 New Components

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| **QuickCategories** | `components/quick-categories.tsx` | 6 service categories | None |
| **RecentProfessionalsSection** | `components/recent-professionals-section.tsx` | Recent viewing history | None |
| **SupportSection** | `components/support-section.tsx` | Help & complaints | None |
| **ProfileWidget** | `components/profile-widget.tsx` | User profile & upload | `onEditClick?` |

---

## 🎣 New Hooks

| Hook | File | Returns | Usage |
|------|------|---------|-------|
| **useRecentProfessionals** | `hooks/use-recent-professionals.ts` | `{professionals, addProfessional, removeProfessional, clearAll, isLoading}` | Track viewed professionals |
| **useComplaints** | `hooks/use-complaints.ts` | `{complaints, submitComplaint, resolveComplaint, isLoading}` | Manage complaints |

---

## 💾 localStorage Keys

```javascript
// Recent Professionals (max 12 entries)
localStorage.getItem('skillbazaar_recent_professionals')

// Complaints (status: pending/resolved)
localStorage.getItem('skillbazaar_complaints')

// User Profile (existing)
localStorage.getItem('skillbazaar_user')
```

---

## 🔄 Data Structures

### RecentProfessional
```typescript
{
  id: string
  name: string
  skill: string
  image: string (URL or base64)
  rating: number
  reviews: number
  type: "digital" | "onsite"
  viewedAt: number (timestamp)
}
```

### Complaint
```typescript
{
  id: string (auto-generated)
  subject: string
  description: string
  email: string
  status: "pending" | "resolved"
  createdAt: number (timestamp)
}
```

---

## 🔀 Navigation Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/customer` | Main dashboard |
| `/technicians` | All professionals |
| `/technicians?skill=X&type=digital` | Filtered view |
| `/technician/[id]` | Professional detail |
| `/dashboard/customer/support` | Support page |

---

## 🎨 Design Tokens

```javascript
// Primary Color (Emerald)
#00b894 / oklch(0.696 0.17 162.48)

// Service Badges
Digital: #3B82F6 (Blue)
Onsite: #06B6D4 (Cyan)

// Border Radius
0.75rem (all cards)

// Transitions
300ms ease-in-out (all interactions)
```

---

## 🧩 Integration Points

### Professional Detail Page
```tsx
import { useRecentProfessionals } from "@/hooks/use-recent-professionals"

useEffect(() => {
  addProfessional({
    id: technician.id,
    name: technician.name,
    // ... other fields
  })
}, [technician])
```

### Category Navigation
```tsx
router.push(`/technicians?skill=${name}&type=${type}`)
```

### Complaint Submission
```tsx
const { submitComplaint } = useComplaints()
const complaint = submitComplaint({ subject, description, email })
```

---

## ✅ Component States

### QuickCategories
- Default: 6 cards visible
- Hover: Scale up, green border
- Click: Navigate with filters

### RecentProfessionalsSection
- Empty: Show "No Recent" message
- Loading: Spinner
- Loaded: Grid of professionals
- 1-6: Show all
- 7+: Show 6 + "View All" button

### SupportSection
- Static: Always visible
- Modal: Opens on "File Complaint"
- Form: Validates on submit
- Success: Shows checkmark, auto-closes

### ProfileWidget
- Avatar: Hover shows upload icon
- Form: Validates file type/size
- Success: Toast notification
- Profile %: Calculates from fields

---

## 🔧 Common Modifications

### Add New Category
```tsx
// In quick-categories.tsx CATEGORIES array
{
  id: "new-id",
  name: "Category Name",
  icon: IconComponent,
  type: "digital" | "onsite",
  description: "...",
  color: "bg-color-500",
  bgColor: "bg-color-50",
}
```

### Add Support Channel
```tsx
// In support-section.tsx, add new card
<Card className="...">
  <IconComponent />
  <h3>Channel Name</h3>
  <p>Description</p>
  <Button>Action</Button>
</Card>
```

### Modify Profile Widget
```tsx
// In profile-widget.tsx
// Update fields in calculateCompletion()
const fields = [
  user.name,
  user.email,
  user.phone,
  user.profilePicture,
  // Add more fields here
]
```

---

## 🐛 Debugging Tips

### Check Recent Professionals
```javascript
JSON.parse(localStorage.getItem('skillbazaar_recent_professionals'))
```

### Check Complaints
```javascript
JSON.parse(localStorage.getItem('skillbazaar_complaints'))
```

### Clear All Data
```javascript
localStorage.clear()
```

### Monitor Component Renders
```tsx
useEffect(() => {
  console.log('Component mounted/updated')
  return () => console.log('Component unmounted')
}, [])
```

---

## 📊 Performance Tips

1. **Limit Recent Professionals**: Max 12 entries (prevents bloat)
2. **Image Size**: Max 5MB file size
3. **localStorage**: ~5-10MB limit (varies by browser)
4. **Complaints**: Periodic cleanup recommended

---

## 🔐 Security Notes

✅ No passwords stored
✅ No auth tokens stored
✅ No sensitive data persisted
✅ Images stored as data URLs
✅ XSS prevention via React JSX
✅ No external API calls from localStorage

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Tablets
md: 768px   // Tablets+
lg: 1024px  // Desktop
xl: 1280px  // Large screens
```

### Component Behavior
- **Mobile**: 1 column, sidebar hidden
- **Tablet**: 2 columns, sidebar visible
- **Desktop**: 3 columns, sidebar sticky

---

## 🎯 Testing Quick Commands

```bash
# Build
npm run build

# Lint
npm run lint

# Dev with debug
NODE_OPTIONS='--inspect' npm run dev
```

---

## 🔄 Update Checklist

When updating dashboard:
- [ ] Update component in relevant file
- [ ] Test on desktop/tablet/mobile
- [ ] Check console for errors
- [ ] Verify localStorage keys intact
- [ ] Test navigation routes
- [ ] Update documentation if needed

---

## 📞 File Quick Links

| File | Lines | Purpose |
|------|-------|---------|
| `app/dashboard/customer/page.tsx` | 68 | Main dashboard |
| `components/quick-categories.tsx` | 152 | Categories |
| `components/recent-professionals-section.tsx` | 114 | Recent list |
| `components/support-section.tsx` | 198 | Support system |
| `components/profile-widget.tsx` | 169 | Profile |
| `hooks/use-recent-professionals.ts` | 65 | Professional tracking |
| `hooks/use-complaints.ts` | 54 | Complaint management |

---

## ✨ Feature Matrix

| Feature | Component | Hook | localStorage | Route |
|---------|-----------|------|--------------|-------|
| Categories | QuickCategories | - | - | `/technicians?skill=X` |
| Recent | RecentProfessionalsSection | useRecentProfessionals | ✅ | `/technician/[id]` |
| Complaints | SupportSection | useComplaints | ✅ | Modal |
| Profile | ProfileWidget | useUser | ✅ | Sidebar |
| Navigation | DashboardSidebar | - | - | Various |

---

## 🎓 Learning Resources

**Documentation Files**:
1. `CUSTOMER_DASHBOARD_COMPLETE.md` - Feature overview
2. `DASHBOARD_TESTING_GUIDE.md` - Testing procedures
3. `DASHBOARD_COMPONENT_API.md` - Technical details
4. `CUSTOMER_DASHBOARD_FINAL_REPORT.md` - Summary report

---

## ⚡ Hot Tips

💡 Use `useRecentProfessionals()` before fetching from API for instant UX
💡 Profile upload converts to base64 for localStorage compatibility
💡 Complaint IDs use timestamp format for natural sorting
💡 Category type matching filters prevent mismatched results
💡 ProfileWidget updates dynamically - no refresh needed

---

**Last Updated**: January 22, 2026
**Status**: Production Ready ✅
**Questions?** Check documentation files or component comments
