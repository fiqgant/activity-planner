import { addDays, format } from "date-fns"

export type Priority = "high" | "medium" | "low"
export type FocusArea = "marketing" | "keuangan" | "operasional" | "growth"

export interface Activity {
  id: string
  name: string
  category: string
  startDate: Date
  endDate: Date
  duration: number
  priority: Priority
  pic: string
  budget?: string
  note?: string
}

export interface PlanInfo {
  team: string
  business: string
  brand: string
  goals: string
}

const ACTIVITY_POOLS: Record<string, { name: string; defaultDuration: number; priority: Priority; pics: string[] }[]> = {
  Marketing: [
    { name: "Membuat akun media sosial sebagai channel promosi", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Hendra Kusuma"] },
    { name: "Mengumpulkan preferensi konsumen dalam menggunakan media sosial", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia"] },
    { name: "Membuat email khusus sesuai identitas merek", defaultDuration: 2, priority: "medium", pics: ["Mega Octavia", "Doni Prasetyo"] },
    { name: "Membuat konten promosi di media sosial", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Hendra Kusuma"] },
    { name: "Merancang moodboard konten", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia"] },
    { name: "Membuat konten kalender", defaultDuration: 2, priority: "medium", pics: ["Mega Octavia", "Doni Prasetyo"] },
    { name: "Menentukan hashtag rutin dalam postingan", defaultDuration: 2, priority: "low", pics: ["Mega Octavia"] },
    { name: "Merancang promo khusus hari spesial", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia", "Hendra Kusuma"] },
    { name: "Membuat program giveaway mingguan", defaultDuration: 5, priority: "low", pics: ["Mega Octavia", "Hendra Kusuma"] },
    { name: "Mengumpulkan testimoni pelanggan", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan"] },
    { name: "Melakukan riset pasar terhadap produk baru", defaultDuration: 5, priority: "high", pics: ["Siti Rahayu", "Budi Santoso"] },
    { name: "Melakukan evaluasi strategi", defaultDuration: 3, priority: "medium", pics: ["Budi Santoso", "Siti Rahayu"] },
  ],
  Keuangan: [
    { name: "Menghitung HPP produk baru", defaultDuration: 3, priority: "high", pics: ["Lisa Permata", "Dewi Lestari"] },
    { name: "Membuat anggaran", defaultDuration: 3, priority: "high", pics: ["Lisa Permata"] },
    { name: "Biaya anggaran marketing", defaultDuration: 2, priority: "medium", pics: ["Lisa Permata", "Mega Octavia"] },
    { name: "Biaya anggaran produksi", defaultDuration: 2, priority: "high", pics: ["Lisa Permata", "Rina Susilowati"] },
    { name: "Membuat laporan penjualan mingguan", defaultDuration: 2, priority: "high", pics: ["Lisa Permata"] },
    { name: "Mencatat seluruh pemasukan dan pengeluaran usaha setiap hari secara konsisten", defaultDuration: 1, priority: "high", pics: ["Lisa Permata", "Dewi Lestari"] },
    { name: "Membuat form invoice", defaultDuration: 2, priority: "medium", pics: ["Lisa Permata"] },
  ],
  Operasional: [
    { name: "Mencari 3 opsi supplier yang lebih affordable", defaultDuration: 5, priority: "high", pics: ["Rudi Hermawan", "Hendra Kusuma"] },
    { name: "Membeli bahan baku", defaultDuration: 2, priority: "high", pics: ["Rudi Hermawan"] },
    { name: "Membeli peralatan", defaultDuration: 3, priority: "high", pics: ["Doni Prasetyo", "Hendra Kusuma"] },
    { name: "Membuat SOP produksi", defaultDuration: 4, priority: "high", pics: ["Rina Susilowati", "Doni Prasetyo"] },
    { name: "Produksi 50pcs per minggu", defaultDuration: 7, priority: "high", pics: ["Rina Susilowati"] },
    { name: "Evaluasi laporan penjualan", defaultDuration: 2, priority: "medium", pics: ["Budi Santoso", "Rina Susilowati"] },
    { name: "Mengumpulkan feedback pelanggan", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan"] },
  ],
}

export const CATEGORY_NAMES = ["Marketing", "Keuangan", "Operasional"]

export interface GeneratorInput {
  startDate: Date
  teamSize: number
  focusArea?: FocusArea
}

export function generateActivityPlan(input: GeneratorInput): Activity[] {
  const { startDate, teamSize } = input
  const maxParallel = Math.max(2, Math.min(teamSize, 4))
  const countPerCat = Math.max(3, Math.ceil(teamSize * 1.5))
  const activities: Activity[] = []
  let globalIndex = 0

  CATEGORY_NAMES.forEach((category) => {
    const pool = [...(ACTIVITY_POOLS[category] || [])].sort(() => Math.random() - 0.5)
    pool.slice(0, Math.min(countPerCat, pool.length)).forEach((item, localIdx) => {
      const dayOffset = Math.floor(globalIndex / maxParallel) * item.defaultDuration
      const start = addDays(startDate, dayOffset)
      const end = addDays(start, item.defaultDuration)
      const pic = item.pics[localIdx % item.pics.length]
      activities.push({
        id: `ACT-${String(globalIndex + 1).padStart(3, "0")}`,
        name: item.name,
        category,
        startDate: start,
        endDate: end,
        duration: item.defaultDuration,
        priority: item.priority,
        pic,
      })
      globalIndex++
    })
  })

  return activities
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy")
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Marketing: "bg-pink-100 text-pink-800",
    Keuangan: "bg-green-100 text-green-800",
    Operasional: "bg-purple-100 text-purple-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}
