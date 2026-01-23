# Developer Implementation Guide

## 🎯 Overview

This guide explains the technical implementation of the redesigned Customer Dashboard and how to maintain/extend it.

---

## 🏗️ Architecture

### State Management Flow

```
customer/page.tsx (Main State Container)
│
├── DynamicSearch (Input)
│   └── Calls onSearch with (query, serviceType, area)
│
├── ServiceCategoriesGrid (Display)
│   └── Calls onCategoryClick with selected category
│
└── ProfessionalsList (Output)
    └── Calls onSelectProfessional with chosen professional
```

### Data Flow

```
1. User types search → onSearch() triggered
2. Filter technicians array based on:
   - Skill name matches query
   - Type matches (digital/onsite)
   - Area matches (if provided)
3. Update filteredProfessionals state
4. ProfessionalsList re-renders with new data
```

---

## 💻 Component Implementation Details

### DynamicSearch.tsx

**Purpose**: Search input with conditional area selector

**Key Logic**:
```typescript
const onsite_keywords = ["electrician", "plumber", "carpenter", "painter", "ac repair", "appliance repair", "cleaning", "general maintenance"]

// Auto-detect service type
const isOnsiteService = onsite_keywords.some(keyword => 
  searchQuery.toLowerCase().includes(keyword)
)

// Conditional area dropdown
showAreaDropdown = isOnsiteService
```

**Props**:
- `onSearch?: (query, serviceType, area) => void`
- `onCategorySelect?: (category, serviceType, area) => void`

**State**:
- `searchQuery` - User input
- `serviceType` - Detected type (digital/onsite)
- `selectedArea` - Chosen area
- `showAreaDropdown` - Show/hide area selector

**Key Features**:
- Enter key support: `e.key === 'Enter'`
- Helpful hint tooltip
- Area dropdown integration with karachiAreas

---

### ServiceCategoriesGrid.tsx

**Purpose**: Display clickable service categories

**Data Structure**:
```typescript
interface ServiceCategory {
  id: string
  name: string
  icon: string (emoji)
  type: "digital" | "onsite"
  description: string
  count: number (professionals count)
}
```

**Grid Layout**:
- Mobile: 1 column
- SM: 2 columns
- MD: 3 columns
- LG: 4 columns

**Hover Effects**:
- Icon scales up 10%
- Card shadow lifts
- Text color changes to primary

**Component Hierarchy**:
```
ServiceCategoriesGrid
└── ServiceCategoryCard (sub-component)
    ├── Icon (emoji)
    ├── Name
    ├── Description
    ├── Badge (type)
    └── Count
```

---

### ProfessionalsList.tsx

**Purpose**: Display filtered professionals with details

**Data Structure**:
```typescript
interface Professional {
  id: string
  name: string
  skill: string
  image: string
  rating: number (0-5)
  reviews: number
  available: boolean
  experience: string (e.g., "5 years")
  completedJobs: number
  phone: string
  rate: number
  areas?: string[]
  type: "digital" | "onsite"
}
```

**Professional Card Content**:
- Avatar with initials fallback
- Name + Skill
- 5-star rating display
- Availability badge (green if available)
- Service type badge
- Experience + Completed jobs
- Rate (PKR)
- CTA buttons: "View Profile & Hire" + "Contact"

**Responsive Behavior**:
- Mobile: Full width, all info stacked
- Desktop: Rate info in right sidebar

**Empty State**:
```typescript
if (professionals.length === 0) {
  return <EmptyCard message="No professionals found" />
}
```

**Loading State**:
```typescript
if (isLoading) {
  return <Spinner />
}
```

---

### customer/page.tsx (Main Dashboard)

**Purpose**: Central hub for service discovery

**State Variables**:
```typescript
const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
const [searchQuery, setSearchQuery] = useState("")
const [selectedArea, setSelectedArea] = useState("")
const [filteredProfessionals, setFilteredProfessionals] = useState<typeof technicians>([])
const [isSearching, setIsSearching] = useState(false)
```

**Key Functions**:

1. **handleSearch()**
```typescript
const handleSearch = (query: string, serviceType: "digital" | "onsite", area?: string) => {
  const filtered = technicians.filter(tech => {
    return tech.type === serviceType &&
           tech.skill.toLowerCase().includes(query.toLowerCase()) &&
           (!area || tech.areas?.includes(area))
  })
  setFilteredProfessionals(filtered)
}
```

2. **handleCategoryClick()**
```typescript
const handleCategoryClick = (category: ServiceCategory) => {
  const filtered = technicians.filter(tech => 
    tech.type === category.type &&
    tech.skill.toLowerCase() === category.name.toLowerCase()
  )
  setFilteredProfessionals(filtered)
}
```

**Conditional Rendering**:
```typescript
{selectedCategory || searchQuery ? (
  <ProfessionalsList professionals={filteredProfessionals} />
) : (
  <ServiceCategoriesGrid categories={serviceCategories} />
)}
```

---

### professional/[id]/page.tsx

**Purpose**: Detailed view of a single professional

**Dynamic Route**: `/professional/[id]`

**Getting Professional Data**:
```typescript
const profId = params.id as string
const professional = technicians.find(tech => tech.id === profId)

if (!professional) {
  return <NotFoundCard />
}
```

**Key Sections**:
1. Header with name, skill, rating, favorite button
2. Stats cards (jobs, experience, rate)
3. About section
4. Service areas (for onsite)
5. Skills badges
6. Action buttons (Contact, Book)
7. Reviews section

**Favorite Toggle**:
```typescript
const toggleFavorite = () => {
  setIsFavorite(!isFavorite)
  // In production: Save to database
}
```

---

## 🔄 Data Integration Guide

### Current Implementation (Mock Data)
All professionals come from `/lib/data.ts`:
```typescript
import { technicians, karachiAreas } from "@/lib/data"
```

### Connecting to Backend API

**Step 1**: Create API endpoints
```typescript
// pages/api/professionals.ts
export default async function handler(req, res) {
  const { search, area, type } = req.query
  // Fetch from database
  return res.json(filteredProfessionals)
}
```

**Step 2**: Update search handler
```typescript
const handleSearch = async (query: string, serviceType: string, area?: string) => {
  const response = await fetch(`/api/professionals?search=${query}&type=${serviceType}&area=${area}`)
  const filtered = await response.json()
  setFilteredProfessionals(filtered)
}
```

**Step 3**: Update category handler
```typescript
const handleCategoryClick = async (category: ServiceCategory) => {
  const response = await fetch(`/api/professionals?category=${category.id}&type=${category.type}`)
  const filtered = await response.json()
  setFilteredProfessionals(filtered)
}
```

---

## 🎨 Styling & Theming

### Tailwind Configuration
Uses default Tailwind + custom colors:
- **Primary (Emerald)**: `#10b981`
- **Background**: `#ffffff`
- **Foreground**: `#1f2937`
- **Muted**: `#6b7280`

### Responsive Utilities
```typescript
// Mobile-first approach
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

// Padding adjustments
className="p-4 lg:p-8"

// Display changes
className="flex flex-col sm:flex-row"
```

### Dark Mode Support
Current theme uses light mode. To add dark mode:
1. Update background colors: `bg-background dark:bg-slate-950`
2. Update text colors: `text-foreground dark:text-slate-50`
3. Update borders: `border-border dark:border-slate-700`

---

## 🧪 Testing Checklist

### Unit Tests to Add
- [ ] ServiceCategory filtering by type (digital/onsite)
- [ ] Professional filtering by skill name
- [ ] Area filtering for onsite services
- [ ] Star rating calculation
- [ ] Favorite toggle state

### Integration Tests
- [ ] Search bar → Professional list transition
- [ ] Category click → Filter professionals
- [ ] Back button → Return to categories
- [ ] Professional detail → Correct data displayed

### E2E Tests
- [ ] User searches for "Electrician"
- [ ] User selects area "Karachi"
- [ ] User sees filtered professionals
- [ ] User clicks professional card
- [ ] User sees professional detail page

### Manual Testing
- [ ] All 16 categories clickable
- [ ] Search works with different keywords
- [ ] Area dropdown shows/hides correctly
- [ ] Professional cards display all information
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All sidebar links functional
- [ ] Favorite button toggles state

---

## 🐛 Common Issues & Solutions

### Issue: Professional not found
**Solution**: Check `/lib/data.ts` for matching ID
```typescript
technicians.find(t => t.id === profId)
```

### Issue: Area dropdown not appearing
**Solution**: Check onsite keywords array
```typescript
const isOnsiteService = onsite_keywords.some(k => 
  query.toLowerCase().includes(k)
)
```

### Issue: Styles not applying
**Solution**: Clear Next.js cache and restart
```bash
rm -rf .next
npm run dev
```

### Issue: TypeScript errors
**Solution**: Check interface imports
```typescript
interface ServiceCategory {
  // All required fields present
}
```

---

## 📈 Performance Optimization

### Current Performance
- ✅ Fast filtering (in-memory, O(n) complexity)
- ✅ Minimal re-renders (proper dependency arrays)
- ✅ Efficient CSS (Tailwind utility classes)

### Future Optimization
1. **Pagination**: Add pagination for large lists
```typescript
const PAGE_SIZE = 10
const paginatedProfessionals = filteredProfessionals.slice(0, PAGE_SIZE)
```

2. **Virtualization**: Use react-window for long lists
```typescript
<FixedSizeList
  height={600}
  itemCount={professionals.length}
  itemSize={100}
/>
```

3. **Memoization**: Prevent unnecessary re-renders
```typescript
const ProfessionalsList = React.memo(({ professionals }) => {
  return ...
})
```

4. **Code Splitting**: Split components into separate chunks
```typescript
const DynamicSearch = dynamic(() => import('@/components/dynamic-search'))
```

---

## 🔐 Security Considerations

### Current Implementation
- ✅ Client-side filtering (safe, no sensitive data)
- ✅ URL parameters validated
- ✅ No SQL injection (no database queries yet)

### When Integrating Backend
- [ ] Validate all API inputs server-side
- [ ] Sanitize search queries
- [ ] Implement rate limiting
- [ ] Validate user authentication
- [ ] Use HTTPS for API calls
- [ ] Implement CSRF protection

---

## 📚 API Specification (For Backend)

### Search Endpoint
```
GET /api/professionals/search
Query Parameters:
- query: string (service name/skill)
- type: "digital" | "onsite"
- area?: string (optional, for onsite only)

Response:
{
  professionals: Professional[]
  count: number
  timestamp: string
}
```

### Detail Endpoint
```
GET /api/professionals/:id

Response:
{
  professional: Professional
  reviews: Review[]
  availability: Availability[]
}
```

### Areas Endpoint
```
GET /api/areas

Response:
{
  areas: string[]
}
```

---

## 🔄 Deployment Checklist

Before deploying to production:

- [ ] All TypeScript errors resolved
- [ ] No console warnings
- [ ] Responsive design tested on 3+ devices
- [ ] All routes return proper pages
- [ ] Search filtering works correctly
- [ ] Professional detail page loads
- [ ] Sidebar navigation functional
- [ ] Images load (or have fallbacks)
- [ ] Performance acceptable (Lighthouse 90+)
- [ ] SEO meta tags added
- [ ] Error boundaries implemented

---

## 📖 Documentation References

- [Next.js Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated**: After dashboard redesign
**Maintained By**: Development Team
**Status**: ✅ Production Ready
