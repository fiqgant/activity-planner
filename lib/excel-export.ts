import ExcelJS from "exceljs"
import { format, eachDayOfInterval, addDays } from "date-fns"
import type { Activity, PlanInfo } from "./generator"
import { CATEGORY_NAMES } from "./generator"

const C_GREEN      = "FF133622"
const C_GREEN2     = "FF1a4a2e"
const C_GOLD       = "FFAC7B2E"
const C_WHITE      = "FFFFFFFF"
const C_GRAY_LIGHT = "FFF9FAFB"
const C_GRAY_MID   = "FFF3F4F6"
const C_GRAY_LINE  = "FFE5E7EB"
const RAW_DATA_SHEET = "__data__"

const CATEGORY_COLORS: Record<string, string> = {
  Marketing:   "FFDB2777",
  Keuangan:    "FF16A34A",
  Operasional: "FF7C3AED",
}
const CATEGORY_LABELS = ["A", "B", "C"]
const ID_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

const PRIORITY_LABEL: Record<string, string> = {
  high: "TINGGI", medium: "SEDANG", low: "RENDAH",
}

interface WeekPeriod { label: string; startDate: Date; endDate: Date }

function getWeekNum(day: number) { return day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4 }

function weekStart(y: number, m: number, w: number): Date {
  return new Date(y, m, w === 1 ? 1 : w === 2 ? 8 : w === 3 ? 15 : 22)
}
function weekEnd(y: number, m: number, w: number): Date {
  if (w === 1) return new Date(y, m, 7)
  if (w === 2) return new Date(y, m, 14)
  if (w === 3) return new Date(y, m, 21)
  return new Date(y, m + 1, 0)
}

function generateWeeks(start: Date, end: Date): WeekPeriod[] {
  const periods: WeekPeriod[] = []
  let y = start.getFullYear(), m = start.getMonth(), w = getWeekNum(start.getDate())
  while (true) {
    const wS = weekStart(y, m, w), wE = weekEnd(y, m, w)
    periods.push({ label: `${ID_MONTHS[m]} w-${w}`, startDate: wS, endDate: wE })
    if (wE >= end) break
    if (w < 4) { w++ } else { w = 1; m++; if (m > 11) { m = 0; y++ } }
  }
  return periods
}

function activeInWeek(act: Activity, wp: WeekPeriod) {
  return act.startDate <= wp.endDate && act.endDate > wp.startDate
}

function border(color = C_GRAY_LINE): Partial<ExcelJS.Borders> {
  const s = { style: "thin" as ExcelJS.BorderStyle, color: { argb: color } }
  return { top: s, left: s, bottom: s, right: s }
}
function fill(argb: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } }
}
function colLetter(n: number): string {
  let r = ""
  while (n > 0) { const m = (n - 1) % 26; r = String.fromCharCode(65 + m) + r; n = Math.floor((n - 1) / 26) }
  return r
}

export async function exportToExcel(activities: Activity[], fileName = "activity-plan", planInfo?: PlanInfo) {
  const wb = new ExcelJS.Workbook()
  wb.creator = "WBIIC Activity Plan Generator"
  wb.created = new Date()

  const allDates  = activities.flatMap(a => [a.startDate, a.endDate])
  const minDate   = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate   = new Date(Math.max(...allDates.map(d => d.getTime())))
  const weeks     = generateWeeks(minDate, maxDate)
  const FIXED     = 5  // No, Activities, PIC, Budget, Note
  const totalCols = FIXED + weeks.length
  const year      = new Date().getFullYear()
  const teamName  = planInfo?.team || "WBIIC"
  const title     = `ACTIVITY PLAN OF ${teamName} - AY ${year}/${year + 1}`

  // ── Sheet 1: Activity Plan (matches template) ───────────────────────────
  const ws1 = wb.addWorksheet("Activity Plan")
  ws1.getColumn(1).width = 5
  ws1.getColumn(2).width = 38
  ws1.getColumn(3).width = 18
  ws1.getColumn(4).width = 15
  ws1.getColumn(5).width = 18
  for (let i = FIXED + 1; i <= totalCols; i++) ws1.getColumn(i).width = 9

  // Row 1: Title
  ws1.mergeCells(`A1:${colLetter(totalCols)}1`)
  Object.assign(ws1.getCell("A1"), {
    value: title,
    font: { name: "Calibri", size: 14, bold: true, color: { argb: C_WHITE } },
    fill: fill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
  })
  ws1.getRow(1).height = 30

  // Row 2: thin green spacer
  ws1.mergeCells(`A2:${colLetter(totalCols)}2`)
  ws1.getCell("A2").fill = fill(C_GREEN)
  ws1.getRow(2).height = 6

  // Rows 3-6: Team, Business, Brand, Goals
  const infoRows: [string, string][] = [
    ["Team      :", planInfo?.team     || ""],
    ["Business :", planInfo?.business  || ""],
    ["Brand      :", planInfo?.brand   || ""],
    ["Goals      :", planInfo?.goals   || ""],
  ]
  infoRows.forEach(([label, value], i) => {
    const r = 3 + i
    ws1.getRow(r).height = 18
    const lc = ws1.getRow(r).getCell(1)
    lc.value = label
    lc.font = { name: "Calibri", size: 10, bold: true }
    lc.fill = fill(C_GRAY_MID)
    lc.border = border()
    lc.alignment = { horizontal: "left", vertical: "middle" }
    ws1.mergeCells(r, 2, r, totalCols)
    const vc = ws1.getRow(r).getCell(2)
    vc.value = value
    vc.font = { name: "Calibri", size: 10 }
    vc.fill = fill(C_WHITE)
    vc.border = border()
    vc.alignment = { horizontal: "left", vertical: "middle" }
  })

  ws1.getRow(7).height = 6
  ws1.getRow(8).height = 6

  // Row 9: Fixed col headers + "Time" merged
  ws1.getRow(9).height = 20
  ;["No.", "Activities", "PIC", "Budget", "Note"].forEach((h, i) => {
    const c = ws1.getRow(9).getCell(i + 1)
    c.value = h
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } }
    c.fill = fill(C_GREEN); c.border = border()
    c.alignment = { horizontal: "center", vertical: "middle" }
  })
  if (weeks.length > 0) {
    ws1.mergeCells(9, FIXED + 1, 9, totalCols)
    const tc = ws1.getRow(9).getCell(FIXED + 1)
    tc.value = "Time"
    tc.font = { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } }
    tc.fill = fill(C_GREEN); tc.border = border()
    tc.alignment = { horizontal: "center", vertical: "middle" }
  }

  // Row 10: Week labels
  ws1.getRow(10).height = 28
  for (let i = 1; i <= FIXED; i++) {
    ws1.getRow(10).getCell(i).fill = fill(C_GREEN)
    ws1.getRow(10).getCell(i).border = border()
  }
  weeks.forEach((wp, i) => {
    const c = ws1.getRow(10).getCell(FIXED + 1 + i)
    c.value = wp.label
    c.font = { name: "Calibri", size: 8, bold: true, color: { argb: C_WHITE } }
    c.fill = fill(C_GREEN2)
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true }
    c.border = border()
  })

  // Activity rows grouped by category
  let curRow = 11
  CATEGORY_NAMES.forEach((category, catIdx) => {
    const catActs = activities.filter(a => a.category === category)
    if (catActs.length === 0) return
    const label = CATEGORY_LABELS[catIdx] || String.fromCharCode(65 + catIdx)
    const catColor = CATEGORY_COLORS[category] || C_GREEN

    // Category header
    ws1.getRow(curRow).height = 20
    const lc = ws1.getRow(curRow).getCell(1)
    lc.value = label
    lc.font = { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } }
    lc.fill = fill(catColor); lc.border = border(catColor)
    lc.alignment = { horizontal: "center", vertical: "middle" }
    ws1.mergeCells(curRow, 2, curRow, FIXED)
    const nc = ws1.getRow(curRow).getCell(2)
    nc.value = category
    nc.font = { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } }
    nc.fill = fill(catColor); nc.border = border(catColor)
    nc.alignment = { horizontal: "left", vertical: "middle" }
    weeks.forEach((_, i) => {
      const c = ws1.getRow(curRow).getCell(FIXED + 1 + i)
      c.fill = fill(catColor); c.border = border(catColor)
    })
    curRow++

    // Activities
    catActs.forEach((act, li) => {
      const bg = li % 2 === 0 ? C_WHITE : C_GRAY_LIGHT
      ws1.getRow(curRow).height = 18

      const cells: [number, ExcelJS.CellValue, string][] = [
        [1, li + 1,        bg],
        [2, act.name,      bg],
        [3, act.pic,       bg],
        [4, act.budget || "", bg],
        [5, act.note   || "", bg],
      ]
      cells.forEach(([col, val, bg2]) => {
        const c = ws1.getRow(curRow).getCell(col)
        c.value = val
        c.font = { name: "Calibri", size: 9 }
        c.fill = fill(bg2); c.border = border()
        c.alignment = { horizontal: col === 1 ? "center" : "left", vertical: "middle" }
      })

      weeks.forEach((wp, i) => {
        const active = activeInWeek(act, wp)
        const c = ws1.getRow(curRow).getCell(FIXED + 1 + i)
        c.value = active ? "V" : ""
        c.font = { name: "Calibri", size: 9, bold: true, color: { argb: active ? C_WHITE : C_GRAY_LINE } }
        c.fill = fill(active ? catColor : bg)
        c.border = border(active ? catColor : C_GRAY_LINE)
        c.alignment = { horizontal: "center", vertical: "middle" }
      })
      curRow++
    })

    ws1.getRow(curRow).height = 4
    curRow++
  })

  ws1.views = [{ state: "frozen", ySplit: 10, xSplit: 0, activeCell: "A11" }]

  // ── Sheet 2: Gantt Chart (daily) ───────────────────────────────────────────
  const ws2 = wb.addWorksheet("Gantt Chart")
  const days        = eachDayOfInterval({ start: minDate, end: addDays(maxDate, 1) })
  const fixedCol    = 3
  const ganttTotal  = fixedCol + days.length

  ws2.getColumn(1).width = 5
  ws2.getColumn(2).width = 36
  ws2.getColumn(3).width = 16
  for (let i = fixedCol + 1; i <= ganttTotal; i++) ws2.getColumn(i).width = 3.2

  ws2.mergeCells(`A1:${colLetter(ganttTotal)}1`)
  Object.assign(ws2.getCell("A1"), {
    value: `GANTT CHART — ${title}`,
    font: { name: "Calibri", size: 13, bold: true, color: { argb: C_WHITE } },
    fill: fill(C_GREEN), alignment: { horizontal: "center", vertical: "middle" },
  })
  ws2.getRow(1).height = 28

  ws2.mergeCells(`A2:${colLetter(ganttTotal)}2`)
  Object.assign(ws2.getCell("A2"), {
    value: `Periode: ${format(minDate, "dd MMMM yyyy")} — ${format(maxDate, "dd MMMM yyyy")}`,
    font: { name: "Calibri", size: 10, italic: true, color: { argb: C_GOLD } },
    fill: fill(C_GREEN), alignment: { horizontal: "center", vertical: "middle" },
  })
  ws2.getRow(2).height = 18

  ws2.getRow(3).height = 14
  ;["No", "Aktivitas", "PIC"].forEach((h, i) => {
    const c = ws2.getCell(3, i + 1)
    c.value = h; c.font = { name: "Calibri", size: 9, bold: true, color: { argb: C_WHITE } }
    c.fill = fill(C_GREEN); c.alignment = { horizontal: "center", vertical: "middle" }; c.border = border()
  })

  let mStart = 0
  for (let i = 1; i <= days.length; i++) {
    const last = i === days.length
    const same = !last && format(days[i], "MM/yyyy") === format(days[mStart], "MM/yyyy")
    if (!same) {
      const sc = fixedCol + 1 + mStart, ec = fixedCol + i
      if (sc < ec) ws2.mergeCells(3, sc, 3, ec)
      const mc = ws2.getCell(3, sc)
      mc.value = format(days[mStart], "MMMM yyyy")
      mc.font = { name: "Calibri", size: 8, bold: true, color: { argb: C_WHITE } }
      mc.fill = fill(C_GREEN2); mc.alignment = { horizontal: "center", vertical: "middle" }; mc.border = border()
      mStart = i
    }
  }

  ws2.getRow(4).height = 14
  ;[1, 2, 3].forEach(col => { ws2.getCell(4, col).fill = fill(C_GREEN); ws2.getCell(4, col).border = border() })
  days.forEach((day, i) => {
    const c = ws2.getCell(4, fixedCol + 1 + i)
    c.value = parseInt(format(day, "d"), 10)
    c.font = { name: "Calibri", size: 7, color: { argb: C_WHITE } }
    c.fill = fill(C_GREEN); c.alignment = { horizontal: "center", vertical: "middle" }; c.border = border(C_GREEN2)
  })

  activities.forEach((act, idx) => {
    const rn = 5 + idx, row = ws2.getRow(rn)
    row.height = 18
    const bg = idx % 2 === 0 ? C_WHITE : C_GRAY_LIGHT
    const barColor = CATEGORY_COLORS[act.category] || "FF6B7280"
    const ss = format(act.startDate, "yyyy-MM-dd"), es = format(act.endDate, "yyyy-MM-dd")

    const nc = row.getCell(1); nc.value = idx + 1
    nc.font = { name: "Calibri", size: 9, color: { argb: "FF6B7280" } }
    nc.fill = fill(bg); nc.alignment = { horizontal: "center", vertical: "middle" }; nc.border = border()

    const ac = row.getCell(2); ac.value = act.name
    ac.font = { name: "Calibri", size: 9, bold: true }
    ac.fill = fill(bg); ac.alignment = { horizontal: "left", vertical: "middle" }; ac.border = border()

    const pc = row.getCell(3); pc.value = act.pic
    pc.font = { name: "Calibri", size: 9 }
    pc.fill = fill(bg); pc.alignment = { horizontal: "left", vertical: "middle" }; pc.border = border()

    days.forEach((day, i) => {
      const ds = format(day, "yyyy-MM-dd"), active = ds >= ss && ds < es
      const dc = row.getCell(fixedCol + 1 + i)
      dc.value = ""; dc.fill = fill(active ? barColor : bg); dc.border = border(active ? barColor : C_GRAY_LINE)
    })
  })

  ws2.views = [{ state: "frozen", ySplit: 4, xSplit: 3, activeCell: "D5" }]

  // ── Hidden data sheet for round-trip import ────────────────────────────────
  const wsData = wb.addWorksheet(RAW_DATA_SHEET)
  wsData.state = "hidden"
  ;["ID", "Nama", "Kategori", "Start", "End", "Durasi", "Prioritas", "PIC", "Budget", "Note"].forEach((h, i) => {
    wsData.getRow(1).getCell(i + 1).value = h
  })
  activities.forEach((act, idx) => {
    const row = wsData.getRow(idx + 2)
    row.getCell(1).value = act.id
    row.getCell(2).value = act.name
    row.getCell(3).value = act.category
    row.getCell(4).value = act.startDate.toISOString()
    row.getCell(5).value = act.endDate.toISOString()
    row.getCell(6).value = act.duration
    row.getCell(7).value = act.priority
    row.getCell(8).value = act.pic
    row.getCell(9).value = act.budget || ""
    row.getCell(10).value = act.note || ""
  })

  const buffer = await wb.xlsx.writeBuffer()
  const blob   = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)
  const a   = document.createElement("a")
  a.href = url; a.download = `${fileName}.xlsx`
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}
