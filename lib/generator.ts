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

const ACTIVITY_POOLS: Record<string, { name: string; defaultDuration: number; priority: Priority; pics: string[]; budget: string; note: string }[]> = {
  Marketing: [
    { name: "Membuat akun media sosial sebagai channel promosi", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Hendra Kusuma"], budget: "Rp 0", note: "IG, TikTok, FB" },
    { name: "Mengumpulkan preferensi konsumen dalam menggunakan media sosial", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia"], budget: "Rp 0", note: "Survei Google Form" },
    { name: "Membuat email khusus sesuai identitas merek", defaultDuration: 2, priority: "medium", pics: ["Mega Octavia", "Doni Prasetyo"], budget: "Rp 0", note: "Gmail bisnis" },
    { name: "Membuat konten promosi di media sosial", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Hendra Kusuma"], budget: "Rp 50.000", note: "Desain via Canva" },
    { name: "Merancang moodboard konten", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia"], budget: "Rp 0", note: "Pinterest / Canva" },
    { name: "Membuat konten kalender", defaultDuration: 2, priority: "medium", pics: ["Mega Octavia", "Doni Prasetyo"], budget: "Rp 0", note: "Jadwal posting mingguan" },
    { name: "Menentukan hashtag rutin dalam postingan", defaultDuration: 2, priority: "low", pics: ["Mega Octavia"], budget: "Rp 0", note: "Riset hashtag relevan" },
    { name: "Merancang promo khusus hari spesial", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia", "Hendra Kusuma"], budget: "Rp 100.000", note: "Harbolnas, Lebaran, dll" },
    { name: "Membuat program giveaway mingguan", defaultDuration: 5, priority: "low", pics: ["Mega Octavia", "Hendra Kusuma"], budget: "Rp 200.000", note: "Hadiah produk sendiri" },
    { name: "Mengumpulkan testimoni pelanggan", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan"], budget: "Rp 0", note: "Screenshot / video pendek" },
    { name: "Melakukan riset pasar terhadap produk baru", defaultDuration: 5, priority: "high", pics: ["Siti Rahayu", "Budi Santoso"], budget: "Rp 0", note: "Analisis kompetitor" },
    { name: "Melakukan evaluasi strategi", defaultDuration: 3, priority: "medium", pics: ["Budi Santoso", "Siti Rahayu"], budget: "Rp 0", note: "Review bulanan" },
  ],
  Keuangan: [
    { name: "Menghitung HPP produk baru", defaultDuration: 3, priority: "high", pics: ["Lisa Permata", "Dewi Lestari"], budget: "Rp 0", note: "Harga pokok produksi" },
    { name: "Membuat anggaran", defaultDuration: 3, priority: "high", pics: ["Lisa Permata"], budget: "Rp 0", note: "Anggaran keseluruhan periode" },
    { name: "Biaya anggaran marketing", defaultDuration: 2, priority: "medium", pics: ["Lisa Permata", "Mega Octavia"], budget: "Rp 500.000", note: "Iklan & promosi" },
    { name: "Biaya anggaran produksi", defaultDuration: 2, priority: "high", pics: ["Lisa Permata", "Rina Susilowati"], budget: "Rp 1.000.000", note: "Bahan baku + peralatan" },
    { name: "Membuat laporan penjualan mingguan", defaultDuration: 2, priority: "high", pics: ["Lisa Permata"], budget: "Rp 0", note: "Rekap setiap Jumat" },
    { name: "Mencatat seluruh pemasukan dan pengeluaran usaha setiap hari secara konsisten", defaultDuration: 1, priority: "high", pics: ["Lisa Permata", "Dewi Lestari"], budget: "Rp 0", note: "Gunakan spreadsheet" },
    { name: "Membuat form invoice", defaultDuration: 2, priority: "medium", pics: ["Lisa Permata"], budget: "Rp 0", note: "Template invoice PDF" },
  ],
  Operasional: [
    { name: "Mencari 3 opsi supplier yang lebih affordable", defaultDuration: 5, priority: "high", pics: ["Rudi Hermawan", "Hendra Kusuma"], budget: "Rp 0", note: "Bandingkan harga & kualitas" },
    { name: "Membeli bahan baku", defaultDuration: 2, priority: "high", pics: ["Rudi Hermawan"], budget: "Rp 800.000", note: "Stok 1 bulan" },
    { name: "Membeli peralatan", defaultDuration: 3, priority: "high", pics: ["Doni Prasetyo", "Hendra Kusuma"], budget: "Rp 500.000", note: "Sesuai kebutuhan produksi" },
    { name: "Membuat SOP produksi", defaultDuration: 4, priority: "high", pics: ["Rina Susilowati", "Doni Prasetyo"], budget: "Rp 0", note: "Dokumentasi langkah produksi" },
    { name: "Produksi 50pcs per minggu", defaultDuration: 7, priority: "high", pics: ["Rina Susilowati"], budget: "Rp 1.500.000", note: "Target konsisten tiap minggu" },
    { name: "Target penjualan 50pcs per minggu", defaultDuration: 7, priority: "high", pics: ["Hendra Kusuma", "Rudi Hermawan"], budget: "Rp 0", note: "Monitor pencapaian tiap minggu" },
    { name: "Evaluasi laporan penjualan", defaultDuration: 2, priority: "medium", pics: ["Budi Santoso", "Rina Susilowati"], budget: "Rp 0", note: "Review pencapaian target" },
    { name: "Mengumpulkan feedback pelanggan", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan"], budget: "Rp 0", note: "Form / chat langsung" },
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
        budget: item.budget,
        note: item.note,
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
