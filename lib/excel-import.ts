import ExcelJS from "exceljs"
import type { Activity, Priority } from "./generator"

const RAW_DATA_SHEET = "__data__"

export async function parseExcelActivities(file: File): Promise<Activity[]> {
  const buffer = await file.arrayBuffer()
  const wb = new ExcelJS.Workbook()

  await wb.xlsx.load(buffer)

  const dataSheet = wb.getWorksheet(RAW_DATA_SHEET)
  if (dataSheet) {
    return parseFromDataSheet(dataSheet)
  }

  const planSheet = wb.getWorksheet("Activity Plan")
  if (planSheet) {
    return parseFromPlanSheet(planSheet)
  }

  throw new Error("Invalid Excel file: no Activity Plan sheet found")
}

function parseFromDataSheet(ws: ExcelJS.Worksheet): Activity[] {
  const activities: Activity[] = []

  ws.eachRow((row, rowNum) => {
    if (rowNum <= 1) return

    const id = row.getCell(1).text?.toString().trim() || ""
    const name = row.getCell(2).text?.toString().trim() || ""
    const category = row.getCell(3).text?.toString().trim() || ""
    const startDateStr = row.getCell(4).text?.toString().trim()
    const endDateStr = row.getCell(5).text?.toString().trim()
    const durationStr = row.getCell(6).text?.toString().trim()
    const priorityStr = row.getCell(7).text?.toString().trim()
    const pic = row.getCell(8).text?.toString().trim() || ""
    const budget = row.getCell(9).text?.toString().trim() || undefined
    const note = row.getCell(10).text?.toString().trim() || undefined

    if (!name || !startDateStr || !endDateStr) return

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return

    const priority = mapPriority(priorityStr)
    const duration = parseInt(durationStr, 10) || 1

    activities.push({
      id: id || generateId(),
      name,
      category,
      startDate,
      endDate,
      duration,
      priority,
      pic,
      budget,
      note,
    })
  })

  return activities
}

function parseFromPlanSheet(ws: ExcelJS.Worksheet): Activity[] {
  const activities: Activity[] = []

  ws.eachRow((row, rowNum) => {
    if (rowNum <= 4) return

    const no = parseInt(row.getCell(1).text || "0", 10)
    const name = row.getCell(2).text?.toString().trim() || ""
    const category = row.getCell(3).text?.toString().trim() || ""
    const startStr = row.getCell(4).text?.toString().trim()
    const endStr = row.getCell(5).text?.toString().trim()
    const durationStr = row.getCell(6).text?.toString().trim()
    const priorityStr = row.getCell(7).text?.toString().trim()
    const pic = row.getCell(8).text?.toString().trim() || ""

    if (name === "RINGKASAN" || !name) return
    if (!no || !startStr || !endStr) return

    const startDate = parseDate(startStr)
    const endDate = parseDate(endStr)

    if (!startDate || !endDate) return

    const priority = mapPriority(priorityStr)
    const duration = parseInt(durationStr, 10) || 1

    activities.push({
      id: generateId(),
      name,
      category,
      startDate,
      endDate,
      duration,
      priority,
      pic,
    })
  })

  return activities
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  const slashParts = dateStr.split("/")
  if (slashParts.length === 3) {
    const [d, m, y] = slashParts.map(Number)
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m - 1, d)
    }
  }

  const dashParts = dateStr.split("-")
  if (dashParts.length === 3) {
    const [d, m, y] = dashParts.map(Number)
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m - 1, d)
    }
  }

  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }

  return null
}

function mapPriority(priorityStr: string | undefined): Priority {
  const str = priorityStr?.toUpperCase() || ""
  if (str.includes("TINGGI") || str.includes("HIGH")) return "high"
  if (str.includes("SEDANG") || str.includes("MEDIUM")) return "medium"
  return "low"
}

function generateId(): string {
  return `ACT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}