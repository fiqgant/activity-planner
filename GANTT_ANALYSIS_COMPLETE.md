# Gantt Chart Refactor - Internal Code Patterns Analysis

**Status:** ✅ Complete Analysis  
**Date:** April 23, 2026  
**Repo:** /Users/fiq/Code/NextJS/activityplan  
**TS Diagnostics:** No errors found  

---

## Executive Summary

Three comprehensive documentation files have been created to enable safe refactoring of the Gantt chart component:

| Document | Size | Purpose |
|----------|------|---------|
| **GANTT_REFACTOR_PATTERNS.md** | 11 KB | Complete reference with component API, data shapes, algorithms, and UI patterns |
| **GANTT_REFACTOR_QUICK_REF.md** | 2.7 KB | Lookup table: constraints, positioning algorithm, safe/forbidden changes |
| **GANTT_REFACTOR_CHECKLIST.md** | 7.6 KB | Step-by-step implementation guide with tests and rollback plan |

All analysis is **grounded in actual code**, not generic advice. Each claim references specific file locations and line numbers.

---

## Component API Specification

### Props Interface
```typescript
interface GanttChartProps {
  activities: Activity[]
}
```
- **Single prop:** No callbacks, no configuration options exposed
- **Location:** `components/gantt-chart.tsx` line 12-14
- **Immutable:** Activities passed in, component doesn't modify them

### Activity Data Contract
```typescript
interface Activity {
  id: string              // "ACT-001", "ACT-002", etc.
  name: string            // Activity name (text)
  category: string        // One of 6 fixed categories
  startDate: Date         // JavaScript Date object
  endDate: Date           // JavaScript Date object
  duration: number        // Days (calculated as endDate - startDate)
  priority: Priority      // "high" | "medium" | "low"
  pic: string             // Person In Charge (name string)
}
```
- **Source:** `lib/generator.ts` lines 13-22
- **Constraints:** 15-25 items typical, all dates must be Date objects
- **Categories:** Exactly 6 fixed values (case-sensitive)

---

## Critical Implementation Details

### Sorting Behavior (LOCKED)
**Location:** `gantt-chart.tsx` lines 32-34
```typescript
const sortedActivities = useMemo(() => {
  return [...activities].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}, [activities])
```
- **Always:** Sorted by startDate ascending (earliest → latest)
- **No user control:** Unlike ActivityTable, no sort UI exposed
- **Immutable:** Original activities array not modified
- **Performance:** Wrapped in useMemo to avoid recalculation

### Date Range Calculations (LOCKED)
```typescript
// Earliest start date across all activities
const minDate = Math.min(...activities.map(a => a.startDate.getTime()))

// Latest end date across all activities
const maxDate = Math.max(...activities.map(a => a.endDate.getTime()))

// Total span in days (foundation for all positioning)
const totalDays = Math.ceil((maxDate - minDate) / (1000*60*60*24)) + 1
```
- **Location:** `gantt-chart.tsx` lines 36-48
- **Critical:** Used for all percentage-based positioning calculations
- **Edge case:** Handles single-day activities (totalDays ≥ 1)

### Bar Positioning Algorithm (LOCKED)
```typescript
// Horizontal offset from timeline start
const startOffset = Math.floor(
  (activity.startDate.getTime() - minDate.getTime()) / (1000*60*60*24)
)

// Percentage positioning from left
left: `${(startOffset / totalDays) * 100}%`

// Bar width (capped to prevent overflow)
width: `${Math.min(
  (activity.duration / totalDays) * 100,
  100 - (startOffset / totalDays) * 100
)}%`
```
- **Location:** `gantt-chart.tsx` lines 102-124
- **Formula:** Relative positioning within totalDays span
- **Accuracy:** Depends on totalDays being correctly calculated
- **Must preserve** for accurate timeline representation

### Color Mappings (LOCKED)
**Location:** `gantt-chart.tsx` lines 16-29

**Category → Hex mapping:**
```typescript
const CATEGORY_COLORS: Record<string, string> = {
  "Business Development": "#3b82f6",   // Tailwind blue-500
  "Operasional": "#8b5cf6",            // Tailwind purple-500
  "Keuangan": "#22c55e",               // Tailwind green-500
  "SDM": "#eab308",                    // Tailwind yellow-500
  "Marketing & Sales": "#ec4899",      // Tailwind pink-500
  "Customer Experience": "#06b6d4",    // Tailwind cyan-500
}
```

**Priority → Badge variant mapping:**
```typescript
// From components/ui/badge.tsx lines 18-20
high: "border-transparent bg-red-100 text-red-800"     // Red
medium: "border-transparent bg-orange-100 text-orange-800"  // Orange
low: "border-transparent bg-green-100 text-green-800"   // Green
```

---

## Component Structure & UI Patterns

### Wrapper Pattern (LOCKED)
```typescript
return (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="flex items-center gap-2 text-lg">
        Gantt Chart
        <Badge variant="secondary">{activities.length} activities</Badge>
      </CardTitle>
      <Button onClick={handleDownload} size="sm" variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Content sections */}
    </CardContent>
  </Card>
)
```
- **Pattern:** Standard shadcn/ui Card structure
- **Header:** Title + badge (activity count) + Export button
- **Location:** `gantt-chart.tsx` lines 71-172

### Layout Sections (Current Implementation)
1. **Timeline header** (lines 84-98)
   - Start/end dates + total days
   - Visual reference bar (shows 30-day window)
   
2. **Activity list** (lines 100-154)
   - Max height: `400px` with scroll
   - Per activity: name + bar + dates + priority badge
   
3. **Legend** (lines 156-169)
   - 6 category color boxes
   - Category names

### Empty State Pattern (LOCKED)
```typescript
if (activities.length === 0) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Gantt Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Belum ada data.
        </p>
      </CardContent>
    </Card>
  )
}
```
- **Indonesian copy:** "Belum ada data." (currently hardcoded)
- **Must preserve:** No changes to text or structure

---

## Tailwind & Styling Conventions

### Class Patterns Used in Component
```typescript
// Layout & spacing
space-y-*           // Vertical gaps (space-y-1, space-y-2, space-y-4)
flex, items-center, justify-between  // Flexbox utilities

// Sizing
h-6, w-3, h-full, h-2  // Height/width units (in rem)
py-*, px-*          // Padding (py-3 px-2 = 12px / 8px)
max-h-[400px]       // Explicit max-height (exception for scrollable areas)

// Colors
bg-muted, bg-muted/50        // Background colors
text-muted-foreground        // Text colors
border-background/20         // Semi-transparent borders

// Typography
text-xs, text-sm, text-lg   // Font sizes
font-medium, font-semibold  // Font weights
truncate                    // Text overflow handling

// Effects & states
rounded-md, rounded-full     // Border radius
overflow-hidden             // Clip content
hover:bg-muted/30          // Hover states
transition-all             // Smooth transitions
```

### No CSS-in-JS Rule (MUST PRESERVE)
Only exception: inline style for dynamic colors
```typescript
style={{
  backgroundColor: CATEGORY_COLORS[activity.category] || "#6b7280",
  left: `${(startOffset / totalDays) * 100}%`,
  width: `${Math.min((activity.duration / totalDays) * 100, ...)}%`,
}}
```

---

## Activity Count Constraints

**From `lib/generator.ts` line 217:**
```typescript
const targetCount = Math.min(Math.max(15, teamSize * 3), 25)
```

- **Minimum:** 15 activities (auto-generate mode)
- **Maximum:** 25 activities
- **Current scrollable area:** `max-h-[400px]` 
- **Implication:** ~7-8 rows visible before scrolling at typical row height

---

## Sorting Pattern Reference (From Sibling Component)

**ActivityTable implementation** (`activity-table.tsx` lines 20-61) shows:
```typescript
type SortField = "name" | "category" | "startDate" | "endDate" | "duration" | "priority" | "pic"

const [sortField, setSortField] = useState<SortField>("startDate")
const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

// Toggle sort direction if already on field, else change field and reset to asc
const handleSort = (field) => {
  if (sortField === field) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  } else {
    setSortField(field)
    setSortDirection("asc")
  }
}

// For enums: use numeric order (priority: high=3, medium=2, low=1)
const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
```

**Note:** GanttChart doesn't expose sort UI (yet), but if refactoring adds it, follow ActivityTable pattern.

---

## Date Formatting (LOCKED)

**From `lib/generator.ts` lines 250-252:**
```typescript
import { format } from "date-fns"

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy")  // "23 Apr 2026"
}
```

- **Must use:** All date displays must call `formatDate()`
- **Format:** Always "dd MMM yyyy" (no variations)
- **Locale:** Not explicitly set (uses date-fns default)

---

## Known Issues & Improvement Opportunities

### Dead Code
**Line 105:** `barWidth` calculated but never used
```typescript
const barWidth = Math.max(activity.duration * 8, 20)  // UNUSED
```
Safe to remove if refactoring the bar rendering.

### Timeline Compression
**Line 91:** Reference bar compresses when totalDays > 30
```typescript
{Array.from({ length: Math.min(totalDays, 30) }).map((_, i) => (
  // Renders only 30 divisions even if totalDays = 365
))}
```
Creates visual misalignment between reference bar and actual bar positioning.

### Overflow Issues
1. **Activity names:** Truncate on long names (single line)
2. **Duration text:** Overlaps on bars < 2-3 days duration
3. **Activity list:** Scrolling at `400px` may feel cramped with 25 items

### Legend Scannability
**Lines 159-167:** 6 categories in single flex row
- Can be hard to find specific category visually
- Candidate for collapse/tabs/interactive filter

---

## Context & Data Flow

### Parent: `app/page.tsx`
```typescript
// Lines 110-140
<Tabs defaultValue="activities" className="w-full">
  <TabsContent value="gantt">
    <GanttChart activities={activities} />
  </TabsContent>
</Tabs>
```
- GanttChart is tab content (alongside ActivityTable)
- Layout: `lg:col-span-9` (75% width on desktop, full on mobile)
- Activities state managed at page level, passed down as prop

### Export Integration
```typescript
// Line 50-52
const handleDownload = () => {
  exportToExcel(activities, "activity-plan-gantt")
}
```
- **Function:** `lib/excel-export.ts` (not reviewed, but signature preserved)
- **Data:** Original activities array (unchanged by GanttChart)
- **Button:** Line 78-81, standard Export button pattern

---

## Locked vs. Flexible Areas

### MUST NOT CHANGE ❌
- Component props interface (`activities: Activity[]`)
- Activity data shape (8 fields, specific types)
- Sort order (startDate ascending)
- Color assignments (category → hex, priority → badge colors)
- Positioning algorithm (%)
- Card wrapper structure (`<Card>`, `<CardHeader>`, `<CardContent>`)
- Empty state message ("Belum ada data.")
- Date formatting (`formatDate()` utility)
- Export button functionality
- Immutability (GanttChart doesn't modify activities)

### SAFE TO CHANGE ✅
- Bar rendering technique (DOM, Canvas, SVG, etc.)
- Timeline header (can add markers, month labels, etc.)
- Legend layout (collapse, interactive, reorganized)
- Activity row heights and spacing (`h-6` → `h-8`, etc.)
- Max height constraint (if justified by UX improvement)
- Typography sizing (`text-xs` → `text-sm`, etc.)
- Priority indicator placement (badge position)
- Activity name truncation handling
- Overall structure (as long as output looks similar)

---

## Testing Checklist (Pre & Post Refactor)

### Functional Tests
- [ ] 15 activities render correctly
- [ ] 25 activities render correctly
- [ ] Bar positions match date calculations (spot check 3-5 bars)
- [ ] 2-day activity visible and readable
- [ ] 20-day activity shows full duration
- [ ] Activity names don't cover bars
- [ ] Priority badges show correct colors (red, orange, green)
- [ ] Export button works (activities unchanged)
- [ ] Empty state displays when activities = []
- [ ] Scroll works smoothly in activity list

### Visual Tests
- [ ] Before/after comparison looks similar in overall layout
- [ ] No visual regressions in color, spacing, or alignment
- [ ] Mobile viewport (col-span-9) still works
- [ ] Legend all 6 categories visible

### Performance Tests
- [ ] No lag when rendering 25 activities
- [ ] useMemo optimizations maintained
- [ ] No console warnings or errors

---

## Refactoring Boundaries

### Component Responsibilities (CURRENT)
1. Accept activities array
2. Sort by startDate (ascending)
3. Calculate date range (min/max)
4. Position bars as % of total span
5. Apply category colors
6. Display activity metadata (name, dates, duration, priority)
7. Provide export functionality
8. Show legend

### Component NOT Responsible For
- Activity creation or modification
- Sorting UI (no user control)
- Filtering
- Detail views or drill-down
- State management (stateless)

---

## Files Analyzed

| File | Lines | Purpose |
|------|-------|---------|
| `app/page.tsx` | 153 | Parent component, data flow, tab context |
| `components/gantt-chart.tsx` | 173 | Target component (current implementation) |
| `components/activity-table.tsx` | 253 | Sorting patterns reference, UI conventions |
| `components/ui/badge.tsx` | 39 | Priority variant definitions |
| `components/ui/card.tsx` | (not shown) | shadcn/ui Card component |
| `lib/generator.ts` | 264 | Activity interface, formatDate() utility |
| `tailwind.config.ts` | 76 | Theme config (CSS variables, no color overrides) |
| `package.json` | 39 | Dependencies (React 18, Next 14, shadcn/ui, date-fns) |

---

## Dependencies Available
```json
{
  "react": "^18.2.0",
  "next": "14.1.0",
  "date-fns": "^3.3.1",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.323.0",
  "recharts": "^2.12.0",        // Not currently used in GanttChart
  "class-variance-authority": "^0.7.0"  // For component variants
}
```

---

## Next Steps

1. **Review:** Read `GANTT_REFACTOR_PATTERNS.md` for complete reference
2. **Quick Check:** Consult `GANTT_REFACTOR_QUICK_REF.md` before implementing
3. **Implement:** Follow `GANTT_REFACTOR_CHECKLIST.md` step-by-step
4. **Test:** Run 10-point functional checklist before committing
5. **Verify:** No TypeScript errors, build passes, no regressions

---

## Success Criteria

✅ Component API unchanged  
✅ All 15-25 activities render correctly  
✅ Bar positioning matches date calculations  
✅ Colors match exactly  
✅ Export works  
✅ No TS errors  
✅ No console warnings  
✅ Visual improvements implemented  
✅ No regressions detected  

---

Generated: April 23, 2026  
Repo: /Users/fiq/Code/NextJS/activityplan  
Analysis Status: Complete ✅
