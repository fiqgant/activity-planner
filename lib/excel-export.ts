import ExcelJS from "exceljs"
import { format, eachDayOfInterval, addDays } from "date-fns"
import type { Activity } from "./generator"

const C_GREEN      = "FF133622"
const C_GREEN2     = "FF1a4a2e"
const C_GOLD       = "FFAC7B2E"
const C_WHITE      = "FFFFFFFF"
const C_GRAY_LIGHT = "FFF9FAFB"
const C_GRAY_MID   = "FFF3F4F6"
const C_GRAY_LINE  = "FFE5E7EB"
const RAW_DATA_SHEET = "__data__"

const PRIORITY_BG: Record<string, string> = {
  high:   "FFFEE2E2",
  medium: "FFFFEDD5",
  low:    "FFD1FAE5",
}
const PRIORITY_FG: Record<string, string> = {
  high:   "FFDC2626",
  medium: "FFEA580C",
  low:    "FF16A34A",
}
const PRIORITY_LABEL: Record<string, string> = {
  high: "TINGGI", medium: "SEDANG", low: "RENDAH",
}

const CAT_COLOR: Record<string, string> = {
  "Business Development": "FF2563EB",
  "Operasional":          "FF7C3AED",
  "Keuangan":             "FF4F46E5",
  "SDM":                  "FFD97706",
  "Marketing & Sales":    "FFDB2777",
  "Customer Experience":  "FF0891B2",
}

function border(color = C_GRAY_LINE): Partial<ExcelJS.Borders> {
  const s = { style: "thin" as ExcelJS.BorderStyle, color: { argb: color } }
  return { top: s, left: s, bottom: s, right: s }
}

function solidFill(argb: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } }
}

function colLetter(n: number): string {
  let r = ""
  while (n > 0) {
    const m = (n - 1) % 26
    r = String.fromCharCode(65 + m) + r
    n = Math.floor((n - 1) / 26)
  }
  return r
}

export async function exportToExcel(activities: Activity[], fileName = "activity-plan") {
  const wb = new ExcelJS.Workbook()
  wb.creator = "WBIIC Activity Plan Generator"
  wb.created = new Date()

  const allDates = activities.flatMap(a => [a.startDate, a.endDate])
  const minDate  = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate  = new Date(Math.max(...allDates.map(d => d.getTime())))

  // ── SHEET 1: Activity Plan ──────────────────────────────────────────────
  const ws1 = wb.addWorksheet("Activity Plan")
  ws1.columns = [
    { key: "no",       width: 5  },
    { key: "name",     width: 40 },
    { key: "category", width: 22 },
    { key: "start",    width: 14 },
    { key: "end",      width: 14 },
    { key: "duration", width: 12 },
    { key: "priority", width: 12 },
    { key: "pic",      width: 20 },
  ]

  // Title row
  ws1.mergeCells("A1:H1")
  Object.assign(ws1.getCell("A1"), {
    value: "BUSINESS ACTIVITY PLAN",
    font: { name: "Calibri", size: 16, bold: true, color: { argb: C_WHITE } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
  })
  ws1.getRow(1).height = 34

  // Subtitle
  ws1.mergeCells("A2:H2")
  Object.assign(ws1.getCell("A2"), {
    value: `WBIIC – Politeknik Wilmar Bisnis Indonesia   |   Dicetak: ${format(new Date(), "dd MMMM yyyy")}`,
    font: { name: "Calibri", size: 10, italic: true, color: { argb: C_GOLD } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
  })
  ws1.getRow(2).height = 20

  // Spacer
  ws1.getRow(3).height = 6

  // Column headers
  const COL_HEADERS = [
    "No", "Nama Aktivitas", "Kategori",
    "Tanggal Mulai", "Tanggal Selesai",
    "Durasi (Hari)", "Prioritas", "PIC",
  ]
  const hRow = ws1.getRow(4)
  hRow.height = 22
  COL_HEADERS.forEach((h, i) => {
    const c = hRow.getCell(i + 1)
    c.value = h
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } }
    c.fill = solidFill(C_GREEN)
    c.alignment = { horizontal: "center", vertical: "middle" }
    c.border = border()
  })

  // Data rows
  activities.forEach((act, idx) => {
    const row = ws1.getRow(idx + 5)
    row.height = 20
    const bg = idx % 2 === 0 ? C_WHITE : C_GRAY_LIGHT

    type ColDef = [number, ExcelJS.CellValue, string, "center" | "left"]
    const cols: ColDef[] = [
      [1, idx + 1,                             bg,                      "center"],
      [2, act.name,                            bg,                      "left"  ],
      [3, act.category,                        bg,                      "left"  ],
      [4, format(act.startDate, "dd/MM/yyyy"), bg,                      "center"],
      [5, format(act.endDate,   "dd/MM/yyyy"), bg,                      "center"],
      [6, act.duration,                        bg,                      "center"],
      [7, PRIORITY_LABEL[act.priority],        PRIORITY_BG[act.priority], "center"],
      [8, act.pic,                             bg,                      "left"  ],
    ]
    cols.forEach(([colNum, val, fillColor, align]) => {
      const c = row.getCell(colNum)
      c.value = val
      c.fill = solidFill(fillColor)
      c.border = border()
      c.alignment = { horizontal: align, vertical: "middle" }
      c.font = colNum === 7
        ? { name: "Calibri", size: 10, bold: true, color: { argb: PRIORITY_FG[act.priority] } }
        : { name: "Calibri", size: 10 }
    })
  })

  // Summary block
  const sumStart = activities.length + 6
  ws1.getRow(sumStart - 1).height = 8

  ws1.mergeCells(`A${sumStart}:C${sumStart}`)
  Object.assign(ws1.getCell(`A${sumStart}`), {
    value: "RINGKASAN",
    font: { name: "Calibri", size: 10, bold: true, color: { argb: C_WHITE } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
    border: border(),
  })

  const highCount = activities.filter(a => a.priority === "high").length
  const medCount  = activities.filter(a => a.priority === "medium").length
  const lowCount  = activities.filter(a => a.priority === "low").length
  const totalDur  = activities.reduce((s, a) => s + a.duration, 0)

  const summaryRows: [string, ExcelJS.CellValue, string][] = [
    ["Total Aktivitas",  activities.length,       C_GRAY_MID          ],
    ["Total Durasi",     `${totalDur} hari`,       C_GRAY_MID          ],
    ["Prioritas TINGGI", `${highCount} aktivitas`, PRIORITY_BG.high    ],
    ["Prioritas SEDANG", `${medCount} aktivitas`,  PRIORITY_BG.medium  ],
    ["Prioritas RENDAH", `${lowCount} aktivitas`,  PRIORITY_BG.low     ],
  ]
  summaryRows.forEach(([label, val, bg], i) => {
    const r = sumStart + 1 + i
    ws1.getRow(r).height = 18
    ws1.mergeCells(`A${r}:B${r}`)
    const lc = ws1.getCell(`A${r}`)
    lc.value = label
    lc.font = { name: "Calibri", size: 10, bold: true }
    lc.fill = solidFill(C_GRAY_MID)
    lc.border = border()
    lc.alignment = { horizontal: "left", vertical: "middle" }
    const vc = ws1.getCell(`C${r}`)
    vc.value = val
    vc.font = { name: "Calibri", size: 10 }
    vc.fill = solidFill(bg)
    vc.border = border()
    vc.alignment = { horizontal: "center", vertical: "middle" }
  })

  ws1.views = [{ state: "frozen", ySplit: 4, xSplit: 0, activeCell: "A5" }]

  // ── SHEET 2: Gantt Chart ────────────────────────────────────────────────
  const ws2 = wb.addWorksheet("Gantt Chart")

  const days     = eachDayOfInterval({ start: minDate, end: addDays(maxDate, 1) })
  const fixedCol = 3
  const totalCol = fixedCol + days.length

  ws2.getColumn(1).width = 5
  ws2.getColumn(2).width = 36
  ws2.getColumn(3).width = 16
  for (let i = fixedCol + 1; i <= totalCol; i++) ws2.getColumn(i).width = 3.2

  // Title
  ws2.mergeCells(`A1:${colLetter(totalCol)}1`)
  Object.assign(ws2.getCell("A1"), {
    value: "GANTT CHART — BUSINESS ACTIVITY PLAN",
    font: { name: "Calibri", size: 14, bold: true, color: { argb: C_WHITE } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
  })
  ws2.getRow(1).height = 30

  // Period
  ws2.mergeCells(`A2:${colLetter(totalCol)}2`)
  Object.assign(ws2.getCell("A2"), {
    value: `Periode: ${format(minDate, "dd MMMM yyyy")} — ${format(maxDate, "dd MMMM yyyy")}`,
    font: { name: "Calibri", size: 10, italic: true, color: { argb: C_GOLD } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "center", vertical: "middle" },
  })
  ws2.getRow(2).height = 18

  // Row 3: month labels (merged per month)
  ws2.getRow(3).height = 14
  ;["No", "Aktivitas", "PIC"].forEach((h, i) => {
    const c = ws2.getCell(3, i + 1)
    c.value = h
    c.font = { name: "Calibri", size: 9, bold: true, color: { argb: C_WHITE } }
    c.fill = solidFill(C_GREEN)
    c.alignment = { horizontal: "center", vertical: "middle" }
    c.border = border()
  })

  let mStart = 0
  for (let i = 1; i <= days.length; i++) {
    const last      = i === days.length
    const sameMonth = !last && format(days[i], "MM/yyyy") === format(days[mStart], "MM/yyyy")
    if (!sameMonth) {
      const sc = fixedCol + 1 + mStart
      const ec = fixedCol + i
      if (sc < ec) ws2.mergeCells(3, sc, 3, ec)
      const mc = ws2.getCell(3, sc)
      mc.value = format(days[mStart], "MMMM yyyy")
      mc.font  = { name: "Calibri", size: 8, bold: true, color: { argb: C_WHITE } }
      mc.fill  = solidFill(C_GREEN2)
      mc.alignment = { horizontal: "center", vertical: "middle" }
      mc.border = border()
      mStart = i
    }
  }

  // Row 4: day numbers
  ws2.getRow(4).height = 14
  ;[1, 2, 3].forEach(col => {
    ws2.getCell(4, col).fill = solidFill(C_GREEN)
    ws2.getCell(4, col).border = border()
  })
  days.forEach((day, i) => {
    const c = ws2.getCell(4, fixedCol + 1 + i)
    c.value = parseInt(format(day, "d"), 10)
    c.font  = { name: "Calibri", size: 7, color: { argb: C_WHITE } }
    c.fill  = solidFill(C_GREEN)
    c.alignment = { horizontal: "center", vertical: "middle" }
    c.border = border(C_GREEN2)
  })

  // Activity rows with colored Gantt bars
  activities.forEach((act, idx) => {
    const rowNum   = 5 + idx
    const row      = ws2.getRow(rowNum)
    row.height     = 18
    const rowBg    = idx % 2 === 0 ? C_WHITE : C_GRAY_LIGHT
    const barColor = CAT_COLOR[act.category] || "FF6B7280"
    const startStr = format(act.startDate, "yyyy-MM-dd")
    const endStr   = format(act.endDate,   "yyyy-MM-dd")

    const nc = row.getCell(1)
    nc.value = idx + 1
    nc.font  = { name: "Calibri", size: 9, color: { argb: "FF6B7280" } }
    nc.fill  = solidFill(rowBg)
    nc.alignment = { horizontal: "center", vertical: "middle" }
    nc.border = border()

    const ac = row.getCell(2)
    ac.value = act.name
    ac.font  = { name: "Calibri", size: 9, bold: true }
    ac.fill  = solidFill(rowBg)
    ac.alignment = { horizontal: "left", vertical: "middle" }
    ac.border = border()

    const pc = row.getCell(3)
    pc.value = act.pic
    pc.font  = { name: "Calibri", size: 9 }
    pc.fill  = solidFill(rowBg)
    pc.alignment = { horizontal: "left", vertical: "middle" }
    pc.border = border()

    days.forEach((day, i) => {
      const dayStr  = format(day, "yyyy-MM-dd")
      const isActive = dayStr >= startStr && dayStr < endStr
      const dc = row.getCell(fixedCol + 1 + i)
      dc.value = ""
      dc.fill  = solidFill(isActive ? barColor : rowBg)
      dc.border = border(isActive ? barColor : C_GRAY_LINE)
    })
  })

  // Legend
  const legRow = activities.length + 6
  ws2.getRow(legRow - 1).height = 8
  ws2.mergeCells(`A${legRow}:F${legRow}`)
  Object.assign(ws2.getCell(`A${legRow}`), {
    value: "KETERANGAN WARNA KATEGORI",
    font: { name: "Calibri", size: 9, bold: true, color: { argb: C_WHITE } },
    fill: solidFill(C_GREEN),
    alignment: { horizontal: "left", vertical: "middle" },
    border: border(),
  })
  ws2.getRow(legRow).height = 16

  Object.entries(CAT_COLOR).forEach(([cat, color], i) => {
    const r = legRow + 1 + i
    ws2.getRow(r).height = 14
    const dot = ws2.getCell(`A${r}`)
    dot.fill   = solidFill(color)
    dot.border = border(color)
    ws2.mergeCells(`B${r}:F${r}`)
    const lbl  = ws2.getCell(`B${r}`)
    lbl.value  = cat
    lbl.font   = { name: "Calibri", size: 9 }
    lbl.alignment = { vertical: "middle" }
  })

  ws2.views = [{ state: "frozen", ySplit: 4, xSplit: 3, activeCell: "D5" }]

  // Hidden data sheet for round-trip support
  const wsData = wb.addWorksheet(RAW_DATA_SHEET)
  wsData.state = "hidden"
  wsData.columns = [
    { key: "id", width: 20 },
    { key: "name", width: 40 },
    { key: "category", width: 22 },
    { key: "startDate", width: 12 },
    { key: "endDate", width: 12 },
    { key: "duration", width: 10 },
    { key: "priority", width: 10 },
    { key: "pic", width: 20 },
  ]

  const headerRow = wsData.getRow(1)
  ;["ID", "Nama", "Kategori", "Start", "End", "Durasi", "Prioritas", "PIC"].forEach((h, i) => {
    const c = headerRow.getCell(i + 1)
    c.value = h
    c.font = { name: "Calibri", size: 10, bold: true }
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
  })

  // Download
  const buffer = await wb.xlsx.writeBuffer()
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const a   = document.createElement("a")
  a.href     = url
  a.download = `${fileName}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
