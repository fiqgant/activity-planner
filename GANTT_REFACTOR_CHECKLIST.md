# Gantt Chart Refactor Implementation Checklist

## Pre-Refactor Snapshot (Current State)

### Component Props
```typescript
interface GanttChartProps {
  activities: Activity[]
}
```

### Activity Interface (from lib/generator.ts)
```typescript
interface Activity {
  id: string              // "ACT-001" format
  name: string
  category: string        // One of 6 fixed categories
  startDate: Date
  endDate: Date
  duration: number        // days
  priority: Priority      // "high" | "medium" | "low"
  pic: string
}
```

### Current Render Structure
```
<Card>
  ├─ CardHeader
  │  ├─ CardTitle + Badge (activity count)
  │  └─ Export Button
  ├─ CardContent
  │  ├─ Timeline header (min/max dates, total days)
  │  ├─ Timeline bar (visual reference for 30-day window)
  │  ├─ Activity list (max-h-[400px] overflow-y-auto)
  │  │  └─ Per activity:
  │  │     ├─ Activity name + duration display
  │  │     ├─ Colored bar (positioned by dates)
  │  │     └─ Start date + priority badge + end date
  │  └─ Legend (6 category colors)
```

---

## Refactor Boundaries

### LOCKED (No Changes)
- [ ] **Props interface** - Must remain `activities: Activity[]`
- [ ] **Data source** - Data comes from `lib/generator.ts` Activity type
- [ ] **Sort order** - Must be `startDate` ascending (earliest first)
- [ ] **Color mappings** - Exact hex codes tied to categories
- [ ] **Date math** - Positioning formula: `left% = (startDate - minDate) / totalDays * 100`
- [ ] **Export function** - Export button must work with original data
- [ ] **Wrapper element** - Must be wrapped in `<Card>` with CardHeader/CardContent
- [ ] **Parent context** - Lives in TabsContent within Tabs in app/page.tsx

### FLEXIBLE (Improvement Candidates)
- [ ] **Bar rendering technique** - DOM, Canvas, SVG all viable
- [ ] **Timeline header** - Can add date markers, month labels, week grid
- [ ] **Legend layout** - Can collapse, make interactive, reposition
- [ ] **Activity row height** - Can adjust `h-6` spacing
- [ ] **Max height** - Can reconsider `max-h-[400px]` if justified
- [ ] **Typography sizing** - Can adjust `text-xs`, `text-sm` 
- [ ] **Duration display** - Can hide, move, or abbreviate
- [ ] **Priority indicator** - Can change badge placement or styling

---

## Implementation Steps

### Step 1: Before You Start
- [ ] Copy gantt-chart.tsx to gantt-chart.backup.tsx for reference
- [ ] Note current behavior: How do bars position with 15 items? With 25?
- [ ] Test current state: What happens when totalDays = 100? 365?
- [ ] Verify export still works post-refactor

### Step 2: Preserve Core Logic
- [ ] Keep useMemo hooks for: sortedActivities, minDate, maxDate, totalDays
- [ ] Preserve exact positioning formula (left%, width%)
- [ ] Keep CATEGORY_COLORS map (same hex values)
- [ ] Keep formatDate() calls (use lib/generator.ts version)

### Step 3: Refactor Target Areas
- [ ] **If improving bar rendering:** Test bar width calculation with 2-day vs 20-day activities
- [ ] **If adding timeline header:** Ensure it aligns with bar positions
- [ ] **If restructuring legend:** Verify all 6 categories remain visible
- [ ] **If adjusting height:** Test scrolling with 25 items in new height

### Step 4: Testing Checklist
- [ ] [ ] Auto-generated 15-25 activities render correctly
- [ ] [ ] Bar positions match date calculations
- [ ] [ ] Shortest activity (2-3 days) still visible and readable
- [ ] [ ] Longest activity (7+ days) shows full duration
- [ ] [ ] Activity names don't cover bars
- [ ] [ ] Priority badges render correct colors (red/orange/green)
- [ ] [ ] Export button works (data unchanged)
- [ ] [ ] Empty state displays when no activities
- [ ] [ ] Mobile/tablet viewport works (col-span-9 context)
- [ ] [ ] Scrolling works smoothly with full activity list

### Step 5: Before Committing
- [ ] Run `npm run lint` (no TS errors)
- [ ] Run `npm run build` (production build succeeds)
- [ ] Visual inspection: Compare before/after screenshots
- [ ] Regression test: All features from LOCKED list still work

---

## Specific Code Locations to Reference

### Current Implementation Locations
| Purpose | File | Lines |
|---------|------|-------|
| Component entry | gantt-chart.tsx | 31-172 |
| Sorting logic | gantt-chart.tsx | 32-34 |
| Date calculations | gantt-chart.tsx | 36-48 |
| Category colors | gantt-chart.tsx | 16-23 |
| Bar positioning | gantt-chart.tsx | 102-124 |
| Activity row | gantt-chart.tsx | 108-151 |
| Legend | gantt-chart.tsx | 156-169 |
| Comparison: sorting UI | activity-table.tsx | 20-61 |
| Date formatting | lib/generator.ts | 250-252 |
| Activity type | lib/generator.ts | 13-22 |

### Import Dependencies
```typescript
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Activity, Priority } from "@/lib/generator"
import { formatDate, getCategoryColor } from "@/lib/generator"
import { exportToExcel } from "@/lib/excel-export"
```

---

## Commit Message Template

```
refactor(gantt-chart): improve readability and timeline visualization

- [describe specific improvement]
- Preserves date positioning algorithm
- Maintains category color mapping
- Fixes [specific issue from readability list]

Refs: GANTT_REFACTOR_PATTERNS.md
```

---

## Rollback Plan

If refactor introduces issues:
```bash
git checkout HEAD -- components/gantt-chart.tsx
# OR restore from gantt-chart.backup.tsx if not using git
```

Verify rollback:
```bash
npm run dev
# Navigate to Gantt Chart tab
# Test with auto-generated activities
```

---

## Success Criteria

✅ **Component API:** Unchanged, still accepts `activities: Activity[]`
✅ **Rendering:** All 15-25 activities visible (possibly with scrolling)
✅ **Positioning:** Bars remain accurately positioned by date
✅ **Colors:** Category colors match exactly
✅ **Functionality:** Export, sorting context, empty state all work
✅ **Performance:** No noticeable lag with 25 activities
✅ **Styling:** Consistent with Tailwind conventions (no CSS-in-JS)
✅ **Readability:** Improved from baseline (specified in separate issue)
✅ **Responsive:** Works on mobile (part of col-span-9)
✅ **Type Safety:** TS compiler shows no errors

---

## Known Issues Pre-Refactor
(From GANTT_REFACTOR_QUICK_REF.md section "Readability Issues to Fix")

1. Line 105: `barWidth` var calculated but unused (dead code)
2. Line 91: Timeline reference bar compresses when totalDays > 30
3. Activity list cramped at 400px max-height with 25 items
4. Duration text overlaps on bars shorter than 2-3 days
5. Legend with 6 categories hard to scan in single row

---

## Dependencies & Constraints

### No Breaking Changes Allowed
- Activity interface is shared with ActivityTable component
- Parent component (page.tsx) has no way to pass configuration
- GanttChart is consumed as black box: activities in, rendering out
- Export data must remain unchanged (used by exportToExcel)

### Must Maintain Compatibility
- Date calculations depend on Date objects (not timestamps)
- Category names must match exactly (case-sensitive)
- Priority values are hardcoded in Badge variants
- Tailwind theme uses CSS variables (no custom color overrides possible)

---

## References

- **Detailed Patterns:** GANTT_REFACTOR_PATTERNS.md (335 lines)
- **Quick Reference:** GANTT_REFACTOR_QUICK_REF.md (this file minus checklists)
- **Source Component:** components/gantt-chart.tsx (173 lines)
- **Related:** components/activity-table.tsx (for UI pattern consistency)
- **Data:** lib/generator.ts (Activity interface, formatDate())
