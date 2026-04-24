# Gantt Chart Refactor Patterns & Constraints

## Component API Expectations

### GanttChart Props Interface
```typescript
interface GanttChartProps {
  activities: Activity[]
}
```

**Data Contract:**
- Expects `Activity[]` type from `@/lib/generator`
- No other props accepted (stateless component)
- Uses `useMemo` heavily for date calculations and sorting

### Activity Data Shape
```typescript
interface Activity {
  id: string              // Format: "ACT-001", "ACT-002", etc.
  name: string           // Activity name (text)
  category: string       // One of 6 fixed categories
  startDate: Date        // JavaScript Date object
  endDate: Date          // JavaScript Date object
  duration: number       // Number of days (calculated: endDate - startDate)
  priority: Priority     // "high" | "medium" | "low"
  pic: string            // Person In Charge (PIC names)
}

type Priority = "high" | "medium" | "low"
```

**Source:** `lib/generator.ts` (lines 13-22)

---

## Current Gantt Implementation Details

### Sorting Behavior
**Location:** `components/gantt-chart.tsx` lines 32-34
```typescript
const sortedActivities = useMemo(() => {
  return [...activities].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}, [activities])
```
- **Fixed sort:** Always by `startDate` ascending (earliest → latest)
- **No user control:** Unlike ActivityTable, GanttChart has no sort UI
- **Implication for refactor:** Must preserve this default behavior or add sort UI if changing

### Date Range Calculations
```typescript
// Min date = earliest start date across all activities
const minDate = Math.min(...sortedActivities.map(a => a.startDate.getTime()))

// Max date = latest end date across all activities  
const maxDate = Math.max(...sortedActivities.map(a => a.endDate.getTime()))

// Total span in days (used for percentage positioning)
const totalDays = Math.ceil((maxDate - minDate) / (1000*60*60*24)) + 1
```

**Readability Issue:** When span is >30 days, bar positions compress (line 91: `Math.min(totalDays, 30)`)

### Bar Positioning & Sizing
```typescript
// Horizontal offset (left %)
const startOffset = Math.floor((activity.startDate - minDate) / (1000*60*60*24))
left: `${(startOffset / totalDays) * 100}%`

// Bar width (% of total, capped at end of timeline)
width: `${Math.min((activity.duration / totalDays) * 100, 100 - (startOffset / totalDays) * 100)}%`

// Fallback bar width: max(duration * 8px, 20px) - ONLY FOR DISPLAY, NOT USED IN ACTUAL LAYOUT
barWidth = Math.max(activity.duration * 8, 20)
```

**Issue:** The `barWidth` variable (line 105) is calculated but never used in JSX. Only CSS % widths are applied.

### Color Schemes

**Category Colors (Hex):**
```typescript
const CATEGORY_COLORS: Record<string, string> = {
  "Business Development": "#3b82f6",   // Blue
  "Operasional": "#8b5cf6",            // Purple
  "Keuangan": "#22c55e",               // Green
  "SDM": "#eab308",                    // Yellow
  "Marketing & Sales": "#ec4899",      // Pink
  "Customer Experience": "#06b6d4",    // Cyan
}
```

**Priority Indicator Colors (only in Badge, not bar):**
```typescript
const PRIORITY_COLORS: Record<Priority, string> = {
  high: "#ef4444",        // Red
  medium: "#f97316",      // Orange
  low: "#22c55e",         // Green
}
```

**Note:** Priority colors are defined but ONLY used in Badge variant mapping in `badge.tsx` (lines 18-20):
```typescript
high: "border-transparent bg-red-100 text-red-800"
medium: "border-transparent bg-orange-100 text-orange-800"
low: "border-transparent bg-green-100 text-green-800"
```

---

## Activity Table Sorting Patterns (For Consistency)

**Location:** `components/activity-table.tsx` lines 20-61

### Sort State
```typescript
type SortField = "name" | "category" | "startDate" | "endDate" | "duration" | "priority" | "pic"
type SortDirection = "asc" | "desc"

const [sortField, setSortField] = useState<SortField>("startDate")  // DEFAULT
const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
```

### Sort Logic Pattern
```typescript
switch (sortField) {
  case "startDate":
    comparison = a.startDate.getTime() - b.startDate.getTime()
    break
  case "priority": {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
    break
  }
  // ... other fields
}
return sortDirection === "asc" ? comparison : -comparison
```

**Key Pattern:** Use numeric order for enums (priority: high=3, medium=2, low=1)

---

## Style Conventions

### Tailwind Classes Used in Gantt
- **Card wrapper:** `Card`, `CardHeader`, `CardTitle`, `CardContent` (shadcn/ui)
- **Layout:** `space-y-*`, `flex`, `items-center`, `justify-between`
- **Text sizing:** `text-xs`, `text-sm`, `text-lg`
- **Colors:** `bg-muted`, `text-muted-foreground`, `bg-destructive`
- **Sizing:** `h-6`, `w-3`, `py-2`, `px-1` (consistently using Tailwind units)
- **Overflow:** `max-h-[400px] overflow-y-auto` (explicit pixel heights only when necessary)
- **Rounded:** `rounded-md`, `rounded-full`, `rounded-sm`
- **Transitions:** `transition-all` on bars for hover effects

### Component Wrapper Pattern
```typescript
return (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Content */}
    </CardContent>
  </Card>
)
```

### Empty State Pattern
```typescript
if (activities.length === 0) {
  return (
    <Card className="h-full">
      <CardHeader><CardTitle>Title</CardTitle></CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Belum ada data.
        </p>
      </CardContent>
    </Card>
  )
}
```

---

## Layout Constraints

### Viewport Context
**From `app/page.tsx` lines 54-143:**
- Main layout: `grid grid-cols-1 lg:grid-cols-12 gap-6`
- Gantt lives in: `lg:col-span-9` (75% width on desktop, full width on mobile)
- Gantt is inside a tab panel within `<Tabs>` (shared with ActivityTable)

### Activity List Max Height
**Current:** `max-h-[400px] overflow-y-auto` (line 100)
- Hard constraint on scrollable area
- Should remain consistent for predictable UX

### Activity Count Constraint
**From `lib/generator.ts` line 217:**
```typescript
const targetCount = Math.min(Math.max(15, teamSize * 3), 25)
```
- Minimum: 15 activities (auto-generate)
- Maximum: 25 activities
- Refactor must handle this range comfortably

---

## Icon & Action Patterns

### Available Icons (lucide-react)
```typescript
Download, Button, Badge, ArrowUpDown, ArrowUp, ArrowDown, Calendar, Clock, User, Flag, Trash2, Plus
```

### Header Action Pattern (From ActivityTable)
```typescript
<CardHeader className="flex flex-row items-center justify-between pb-4">
  <CardTitle>Title</CardTitle>
  <Button onClick={handleDownload} size="sm" variant="outline">
    <Download className="h-4 w-4 mr-2" />
    Export
  </Button>
</CardHeader>
```

**Current Gantt Usage:** Has Export button (line 78-81), follows exact pattern

### Badge Variant Map (For GanttChart Priority Display)
```typescript
// In activity-table.tsx
getPriorityVariant = (priority) => priority  // Returns "high" | "medium" | "low"

// In badge.tsx, those map to:
high: "bg-red-100 text-red-800"
medium: "bg-orange-100 text-orange-800"
low: "bg-green-100 text-green-800"
```

---

## Format Utilities

### Date Formatting
**Location:** `lib/generator.ts` line 250-252
```typescript
import { format } from "date-fns"

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy")  // E.g., "23 Apr 2026"
}
```

**Always use `formatDate()` for consistency**

---

## Neighboring UI Patterns to Match

### ActivityTable Structure (For Consistency)
- **Header section with stats:** `"Activity Plan"` + badge showing count
- **Download export button:** Same position, same styling
- **Responsive hiding:** Use `hidden md:table-cell`, `hidden lg:table-cell` for progressive disclosure
- **Hover states:** `hover:bg-muted/30 transition-colors` on rows
- **Empty state message:** Indonesian language, centered in Card

### Tabs Context
**Parent container in `app/page.tsx` line 110-140:**
```typescript
<Tabs defaultValue="activities" className="w-full">
  <TabsList className="mb-4">
    <TabsTrigger value="activities">Activity Plan</TabsTrigger>
    <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
    <TabsTrigger value="guide">Panduan</TabsTrigger>
  </TabsList>
  <TabsContent value="gantt">
    <GanttChart activities={activities} />
  </TabsContent>
</Tabs>
```

**Constraint:** GanttChart must accept `activities` prop and render as full tab content

---

## Refactoring Safety Checklist

- [ ] **Props:** Keep `activities: Activity[]` as only input
- [ ] **Sorting:** Maintain startDate ascending as default (unless adding sort UI)
- [ ] **Date Range:** Continue using min/max date calculations for bar positioning
- [ ] **Colors:** Use exact hex codes from `CATEGORY_COLORS` map
- [ ] **Tailwind:** Follow existing Tailwind patterns (no CSS-in-JS)
- [ ] **Card Wrapper:** Must stay wrapped in `<Card>` with standard `CardHeader`/`CardContent`
- [ ] **Max Height:** Keep `max-h-[400px] overflow-y-auto` on activity list or justify change
- [ ] **Empty State:** Maintain Indonesian copy: "Belum ada data."
- [ ] **Activity Count:** Support 15-25 activities comfortably
- [ ] **Date Format:** Always use `formatDate()` utility
- [ ] **Icon Consistency:** Only use lucide-react icons already imported in repo
- [ ] **Performance:** Preserve `useMemo` for date calculations
- [ ] **Export Button:** Keep styled button with Download icon in header

---

## Summary: What Can Be Refactored

### Safe to Change:
1. **Bar rendering logic:** Can use canvas, SVG, or other approaches if positioning math matches
2. **Legend layout:** Can be collapsed, reorganized, or made interactive
3. **Row height/spacing:** Can adjust `h-6` and `my-2` Tailwind values
4. **Activity name truncation:** Can improve ellipsis handling
5. **Timeline header:** Can add month/week markers (currently just start/end dates)
6. **Priority indicator placement:** Can move badge to different position

### Must NOT Change:
1. Component API: `activities: Activity[]` prop only
2. Default sort order: by startDate ascending
3. Color assignments: Category → hex code mappings
4. Date calculations: Bar positioning algorithm
5. Card wrapper structure
6. Export button functionality
7. Max height constraint (unless refactoring scrolling)

---

## Adjacent Files for Context

- `lib/generator.ts` - Activity data structure + `formatDate()` utility
- `components/activity-table.tsx` - Sorting patterns + UI structure conventions
- `app/page.tsx` - Parent component + context (data flows from page.tsx → GanttChart)
- `tailwind.config.ts` - Theme colors and Tailwind setup (no custom color overrides)
- `components/ui/badge.tsx` - Priority variant definitions
- `components/ui/card.tsx` - Card component from shadcn/ui
