# Gantt Chart Refactor Quick Reference

## Component Contract
- **Props:** `activities: Activity[]` only
- **Data Shape:** 6 fields (id, name, category, startDate, endDate, duration, priority, pic)
- **Activity Range:** 15-25 items typical
- **Sort:** Always by startDate ascending (line 33 gantt-chart.tsx)

## Critical Constraints
| Aspect | Current Value | Must Keep | Notes |
|--------|---------------|-----------|-------|
| Max Height | `max-h-[400px]` | YES | Scrollable area for 15-25 items |
| Bar Positioning | % of totalDays span | YES | Preserves timeline accuracy |
| Category Colors | 6 hex codes (hardcoded) | YES | Same in CATEGORY_COLORS map |
| Priority Badges | Red/Orange/Green | YES | From badge.tsx variants |
| Date Format | "dd MMM yyyy" | YES | Use formatDate() utility |
| Wrapper | `<Card>` + CardHeader/Content | YES | Pattern from shadcn/ui |
| Sort Order | startDate asc | YES | Unless adding sort UI |

## Positioning Algorithm (DON'T BREAK)
```
left% = (activity.startDate - minDate) / totalDays * 100
width% = min((activity.duration / totalDays) * 100, 100 - left%)
```

## Styling Convention
- Use Tailwind only (no inline CSS beyond `style={{backgroundColor}}`
- `space-y-*` for vertical gaps
- `h-6`, `w-3` pattern for bar sizing
- `text-xs`, `text-sm`, `text-lg` for typography
- `rounded-md` default border radius

## Safe to Refactor
✅ Bar rendering technique (canvas, SVG, DOM elements all work)
✅ Legend layout (collapse, reposition, make interactive)
✅ Activity name display (improve truncation)
✅ Timeline header (add month markers)
✅ Row spacing and typography details
✅ Priority indicator placement

## Must NOT Refactor
❌ Component props interface
❌ Data shape expectations
❌ Activity sort order (startDate asc)
❌ Color assignments (category → hex)
❌ Bar positioning math
❌ Card wrapper structure
❌ Date calculations

## Files to Review Before Changes
- `lib/generator.ts` - Activity interface & formatDate()
- `components/activity-table.tsx` - Sorting pattern reference
- `components/ui/badge.tsx` - Priority variant definitions
- `tailwind.config.ts` - No custom colors (uses CSS variables)

## Readability Issues to Fix
1. **Line 105:** `barWidth` calculated but never used
2. **Line 91:** Timeline bar compresses when totalDays > 30
3. **Lines 100-154:** Activity list at fixed 400px max-height may be cramped with 25 items
4. **Line 127-129:** Duration text overlaps on short bars (<2 days)
5. **Line 159-167:** Legend can be hard to scan with 6 category boxes

## Neighboring Components
- **Parent:** `app/page.tsx` (tabs, passes activities array)
- **Sibling:** `ActivityTable` (uses same Activity interface, different sort UI)
- **Import Source:** `lib/generator.ts` (Activity type, formatDate())
