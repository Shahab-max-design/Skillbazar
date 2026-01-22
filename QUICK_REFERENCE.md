# SkillBazaar MVP - Quick Reference Guide

## 🎯 What's New

### 1. Hybrid Sign-Up System
**URL:** `/auth/signup`
- **Path:** Two role options (Service Provider / Hire Services)
- **Service Type:** Onsite vs Digital (for Service Providers)
- **Conditional Forms:** Different fields based on selections
- **Storage:** localStorage (user data persists across sessions)

### 2. Credit Deduction System
**Location:** Technician Dashboard
- **Trigger:** Accept button on booking request
- **Effect:** -1 credit automatically
- **Notification:** Small toast message, auto-dismisses 2.5 seconds
- **Display:** New "Credits Available" stat card
- **Default:** 10 credits on sign-up

### 3. Expanded Technician Database
**Total:** 48 professional technicians
- **5** Electricians
- **5** Plumbers  
- **5** AC Technicians
- **5** Carpenters
- **5** Painters
- **5** Appliance Repair
- **8** Digital Service Providers

**Coverage:** All 15 Karachi areas covered for onsite services

---

## 🔧 Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `app/auth/signup/page.tsx` | Sign-up page with multi-step flow | 539 |
| `hooks/use-user.ts` | User data management & credits | 87 |
| `app/dashboard/technician/page.tsx` | Credit deduction logic + display | 180 |
| `components/navbar.tsx` | Updated "Get Started" button | 79 |
| `lib/data.ts` | Expanded technician database | 1000+ |

---

## 🚀 Quick Test Flow

### Test Sign-Up:
```
Home → Click "Get Started" 
→ Select Role (Service Provider/Customer)
→ If Provider: Choose Onsite/Digital
→ Fill Form (conditional fields)
→ Auto-redirect to Dashboard
```

### Test Credit Deduction:
```
Technician Dashboard 
→ Find Booking Request
→ Click "Accept"
→ See: "1 credit deducted. X remaining"
→ Message auto-disappears after 2.5s
→ Credits card updates
```

### Test Technician Data:
```
Technicians List Page
→ Filter by Service (e.g., "Electrician")
→ Filter by Area (e.g., "DHA")
→ Verify multiple technicians appear
→ Check ratings, reviews, rates
```

---

## 📊 Data Structure

### User Data (localStorage):
```javascript
{
  role: "service-provider" | "customer",
  serviceType: "onsite" | "digital",        // Only if provider
  name: "Full Name",
  email: "email@domain.com",
  phone: "+92 300 XXXXXXX",
  password: "encrypted",
  profilePicture: "url",
  
  // For Onsite Providers:
  area: "DHA",
  onsiteServices: ["Electrician", "Wiring"],
  
  // For Digital Providers:
  digitalSkills: ["Web Development", "React"],
  portfolioLink: "https://portfolio.com",
  hourlyRate: 3000,
  availability: "Full-time",
  
  // Credits:
  credits: 10
}
```

### Technician Data:
```javascript
{
  id: "unique-id",
  name: "Full Name",
  skill: "Service Type",
  skills: ["Skill1", "Skill2"],
  areas: ["Area1", "Area2"],
  rate: 1500,                    // Rs.
  rating: 4.8,                   // Stars
  reviews: 127,                  // Count
  available: true,
  experience: "8 years",
  completedJobs: 450,
  bio: "Professional description",
  phone: "+92 300 XXXXXXX",
  whatsapp: "+92 300 XXXXXXX",
  image: "profile-image-url"
}
```

---

## 🎨 UI Components Used

**Existing Components (Unchanged):**
- Button
- Input
- Label
- Checkbox
- Select (SelectContent, SelectItem, SelectTrigger, SelectValue)
- Icons (Wrench, ArrowRight, ArrowLeft, Check, Coins)

**New Styles:**
- Multi-step sign-up animations (`animate-fade-in`)
- Credit notification toast (amber-50 background)
- Service/skill selection toggles

---

## 💾 Data Persistence

**Sign-Up Data:**
- Stored in: `localStorage['skillbazaar_user']`
- Persists across: Browser sessions, page refreshes
- Cleared by: Manual localStorage.clear() or `clearUser()` hook

**Technician Data:**
- Stored in: `lib/data.ts` (static exports)
- Type: TypeScript interfaces
- Easily migrable to: Backend API/Database

---

## 🔐 Credits System Logic

```javascript
// When Accept button clicked:
1. deductCredits(1) called
2. user.credits -= 1
3. localStorage updated
4. Message shown: "1 credit deducted. X remaining"
5. setTimeout(2500ms) → Clear message
6. StatCard updates silently
7. No modal/alert/popup
8. User flow uninterrupted
```

---

## 📍 Route Map

| Route | Purpose | Auth Required |
|-------|---------|--------------|
| `/` | Home page | No |
| `/auth/signup` | Sign-up flow | No |
| `/signin` | Sign-in page | No (to implement) |
| `/dashboard/customer` | Customer dashboard | Yes |
| `/dashboard/technician` | Technician dashboard | Yes |
| `/dashboard/admin` | Admin dashboard | Yes |
| `/technicians` | Browse technicians | No |
| `/technician/[id]` | Technician details | No |

---

## ✅ FYP/Hackathon Checklist

- [x] 48 realistic technicians with profiles
- [x] All 15 Karachi areas covered
- [x] Both onsite and digital services
- [x] Realistic ratings & reviews
- [x] Professional bios & experience
- [x] Hybrid marketplace sign-up
- [x] Credit-based system
- [x] Non-intrusive notifications
- [x] Multiple services per area
- [x] Multiple technicians per service
- [x] Clean, professional UI
- [x] Smooth user flow
- [x] No empty states

---

## 🐛 Debugging Tips

**Check user data:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('skillbazaar_user'))
```

**Clear user data:**
```javascript
// In browser console:
localStorage.removeItem('skillbazaar_user')
// Then refresh page
```

**Check technician data:**
```javascript
// Open DevTools → Sources → lib/data.ts
// Or check network tab when page loads
```

**Monitor credits:**
- Go to technician dashboard
- Check "Credits Available" card
- Accept a booking
- Watch card update

---

## 🎓 Learning Resources

This implementation demonstrates:
- ✅ Multi-step forms in React
- ✅ Conditional rendering
- ✅ localStorage API usage
- ✅ Custom hooks
- ✅ TypeScript interfaces
- ✅ Next.js routing
- ✅ Component composition
- ✅ State management
- ✅ Toast notifications
- ✅ Database seeding patterns

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage data
3. Check file paths in import statements
4. Ensure all dependencies installed (`npm install` or `pnpm install`)
5. Clear Next.js cache: `rm -rf .next`
6. Rebuild: `npm run build`

---

**Last Updated:** January 2026
**Version:** MVP 1.0
**Status:** Ready for FYP/Hackathon Demo ✅
