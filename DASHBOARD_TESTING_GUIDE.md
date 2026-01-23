# Customer Dashboard - Quick Testing & Usage Guide

## 🚀 Getting Started

### Start the Development Server
```bash
cd C:\Users\hiday\Downloads\PROJECT-2
npm run dev
```

### Access the Dashboard
```
http://localhost:3000/dashboard/customer
```

---

## 📋 Testing Checklist

### 1. Dashboard Page Load
- [ ] Page loads without errors
- [ ] Welcome message displays user name
- [ ] Sidebar shows all navigation links
- [ ] Profile widget visible in sidebar (desktop)

### 2. Quick Categories Section
- [ ] All 6 categories display (3 digital, 3 onsite)
- [ ] Categories have correct icons and colors
- [ ] Service type badges show (Digital=Blue, Onsite=Cyan)
- [ ] Each category has description and button
- [ ] Info box at bottom explains hybrid services

**Test Interactions:**
- [ ] Click "Web Design" → Routes to `/technicians?skill=Web Design&type=digital`
- [ ] Click "Plumber" → Routes to `/technicians?skill=Plumber&type=onsite`
- [ ] Filters auto-apply on technicians page
- [ ] Results update based on selection

### 3. Recent Professionals Section
- [ ] Initially shows empty state (if first visit)
- [ ] "Explore Professionals" button visible
- [ ] Upon visiting professional profiles, they appear here

**Test Tracking:**
1. Go to `/technicians`
2. Click on any professional card
3. View their detail page (e.g., `/technician/1`)
4. Return to dashboard
5. Professional should now appear in "Recent Professionals"

**Test Interactions:**
- [ ] Each professional card shows: avatar, name, skill, rating, type badge
- [ ] Hover reveals "Remove" button
- [ ] Click "View Profile" → Routes to `/technician/[id]`
- [ ] Click "Remove" → Professional removed from list
- [ ] Max 6 shown on dashboard, "View All" button if more than 6
- [ ] Data persists on page refresh

### 4. Support Section
- [ ] Three cards visible: Live Chat, Phone, Submit Complaint
- [ ] Each card has icon and description
- [ ] "Start Chat" button functional
- [ ] "Call Now" button functional (or displays phone)
- [ ] "File Complaint" button opens modal

**Test Complaint Form:**
1. Click "File Complaint"
2. Modal dialog opens
3. Fields visible: Subject, Description
4. Try submit empty → Validation error toast
5. Fill Subject: "Test Issue"
6. Fill Description: "This is a test complaint"
7. Click "Submit Complaint"
8. Success state with checkmark appears
9. Modal auto-closes after 2 seconds
10. Toast notification confirms submission

**Test Persistence:**
- Open browser DevTools (F12)
- Go to Application → LocalStorage
- Find key: `skillbazaar_complaints`
- Should contain your submitted complaints

### 5. Profile Widget (Sidebar)
- [ ] User name displays
- [ ] Email displays
- [ ] Phone displays (if set)
- [ ] Profile picture displays or shows initials
- [ ] Credits displayed
- [ ] Completion percentage shows (with progress bar)

**Test Profile Picture Upload:**
1. Hover over avatar
2. Upload icon appears
3. Click avatar
4. File picker dialog opens
5. Select any image
6. Image uploads and displays immediately
7. Close and reopen dashboard
8. Image persists

**Test Buttons:**
- [ ] "Edit Profile" button → Opens profile edit dialog
- [ ] "Sign Out" button → Logs out user
- [ ] Quick links (Wallet, Support) → Navigate correctly

### 6. Sidebar Navigation
- [ ] All links visible (Desktop): Dashboard, Find Professionals, My Bookings, Messages, Favorites, Wallet, Support
- [ ] Current page highlighted in green
- [ ] Click "Find Professionals" → Routes to `/technicians`
- [ ] Click "Support & Help" → Routes to `/dashboard/customer/support`
- [ ] "Back to Home" link → Routes to `/`
- [ ] "Sign Out" button visible

### 7. Responsive Design Testing

**Desktop (1920px+)**
- [ ] Full sidebar visible
- [ ] Grid shows 3 columns for categories
- [ ] Grid shows 3 columns for recent professionals
- [ ] All content visible without scrolling side-to-side

**Tablet (768px - 1024px)**
- [ ] Sidebar still visible
- [ ] Grid shows 2 columns
- [ ] Responsive spacing
- [ ] No overflow issues

**Mobile (< 768px)**
- [ ] Sidebar hidden (menu toggle if available)
- [ ] Grid shows 1 column
- [ ] Content readable
- [ ] Buttons properly sized
- [ ] No horizontal scroll

### 8. Navigation & Routing
- [ ] Dashboard link → `/dashboard/customer`
- [ ] Category click → `/technicians?skill=X&type=digital|onsite`
- [ ] Professional card → `/technician/[id]`
- [ ] Find Professionals → `/technicians`
- [ ] Support → `/dashboard/customer/support`
- [ ] Browser back button works correctly

### 9. Data Persistence
**localStorage Keys to Check:**
```
skillbazaar_recent_professionals  // Recent professionals list
skillbazaar_complaints             // Submitted complaints
skillbazaar_user                   // User profile data
```

**Test Steps:**
1. Upload profile picture
2. Submit complaint
3. Visit professional profiles
4. Close browser tab completely
5. Reopen dashboard
6. All data should persist

### 10. Error Handling
- [ ] Try uploading non-image file → Error toast
- [ ] Try uploading image > 5MB → File size error
- [ ] Try submitting complaint without subject → Validation error
- [ ] Try submitting complaint without description → Validation error
- [ ] All errors show helpful messages

---

## 🎨 Visual Verification

### Colors Check
- [ ] Primary accent is emerald green (#00b894)
- [ ] Backgrounds are white/off-white
- [ ] Badges: Digital = Blue, Onsite = Cyan
- [ ] Hover states show green tint
- [ ] Cards have subtle shadows

### Typography Check
- [ ] Headers are bold and large (2xl-4xl)
- [ ] Body text is readable
- [ ] Button text is clear and centered
- [ ] No text overflow issues

### Spacing & Layout
- [ ] Consistent padding around sections
- [ ] Proper gap between grid items
- [ ] Sections separated clearly
- [ ] No clipped content

---

## 🔍 Browser DevTools Inspection

### Console
- Open DevTools (F12)
- Click Console tab
- No red error messages should appear
- No warnings about missing components

### Network
- Check Network tab
- All requests complete successfully
- No 404 errors
- Images load correctly

### LocalStorage
- Open Application → LocalStorage
- Verify keys exist:
  - `skillbazaar_recent_professionals`
  - `skillbazaar_complaints`
  - `skillbazaar_user`

### Responsive Design Mode
- Click Device Toolbar (Ctrl+Shift+M)
- Test different device sizes:
  - iPhone 12 (390px)
  - iPad (768px)
  - Desktop (1920px)

---

## 🎯 Key Test Scenarios

### Scenario 1: First-Time Visitor
1. Access dashboard
2. See empty recent professionals
3. Click category
4. Browse professionals
5. Return to dashboard
6. Recent professionals populated

### Scenario 2: Support Contact
1. Click "File Complaint"
2. Fill form
3. Submit
4. See confirmation
5. Refresh page
6. Check localStorage for complaint

### Scenario 3: Complete Profile
1. Upload profile picture
2. Check completion % increases
3. Refresh page
4. Picture persists
5. Completion % stays updated

### Scenario 4: Category Filtering
1. Click "Digital" category
2. Verify only digital professionals show
3. Click "Onsite" category
4. Verify only onsite professionals show
5. Can mix/match with other filters

---

## 🛠️ Troubleshooting

### Dashboard Not Loading
```bash
# Clear cache and restart
npm run dev
# OR
rm -r .next
npm run dev
```

### localStorage Not Working
- Check if localStorage is enabled in browser
- Check console for errors
- Clear browser cache

### Styles Not Applying
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check if Tailwind CSS is loaded
- Check browser console for CSS errors

### Navigation Not Working
- Check URL parameters: `?skill=X&type=Y`
- Verify routes exist in `app/` directory
- Check console for routing errors

---

## 📊 Testing Summary Template

```
Date: ___________
Browser: ___________
Device: ___________

✓ Dashboard loads
✓ Categories work
✓ Recent professionals track
✓ Support form works
✓ Profile upload works
✓ Sidebar navigation works
✓ Responsive design works
✓ Data persists
✓ No console errors

Issues found:
_________________
_________________

Notes:
_________________
_________________
```

---

## 🚀 Performance Tips

- Dashboard typically loads in < 2 seconds
- Category filters respond instantly
- Recent professionals load from localStorage (instant)
- Complaint form submission takes ~500ms (simulated)

---

## 📱 Mobile Testing Checklist

- [ ] Touch targets are 44px minimum
- [ ] No horizontal scroll
- [ ] Images scale properly
- [ ] Buttons accessible
- [ ] Text readable without zoom
- [ ] Forms work on mobile keyboards
- [ ] Modal works on mobile
- [ ] Navigation accessible

---

**Ready to Test?** 🎉
Start with the Testing Checklist above and work through each section methodically.
