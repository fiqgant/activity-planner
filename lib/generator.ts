import { addDays, format } from "date-fns"

export type Priority = "high" | "medium" | "low"
export type FocusArea =
  | "traffic"
  | "conversion"
  | "operasional"
  | "keuangan"
  | "SDM"
  | "customer"
  | "growth"

export interface Activity {
  id: string
  name: string
  category: string
  startDate: Date
  endDate: Date
  duration: number
  priority: Priority
  pic: string
}

const PIC_NAMES = [
  "Budi Santoso",
  "Siti Rahayu",
  "Ahmad Wijaya",
  "Dewi Lestari",
  "Hendra Kusuma",
  "Rina Susilowati",
  "Doni Prasetyo",
  "Mega Octavia",
  "Rudi Hermawan",
  "Lisa Permata",
  "Fajar Nugroho",
  "Ayuningtyas",
  "Rendi Firmansah",
  "Wati Rohmawati",
  "Joko Salim",
  "Diah Kusumawardani",
  "Ali Firmanto",
  "Nina Fauziyah",
  "Rio Andika",
  "Sari Dewi",
]

const ACTIVITY_POOLS: Record<string, { name: string; defaultDuration: number; priority: Priority; pics: string[] }[]> = {
  "Business Development": [
    { name: "Memperluas jaringan distribusi ke daerah baru", defaultDuration: 5, priority: "high", pics: ["Budi Santoso", "Hendra Kusuma"] },
    { name: "Negosiasi kontrak dengan distributor baru", defaultDuration: 3, priority: "high", pics: ["Ahmad Wijaya", "Rendi Firmansah"] },
    { name: "Pengembangan varian produk yang sudah ada", defaultDuration: 7, priority: "medium", pics: ["Doni Prasetyo", "Lisa Permata"] },
    { name: "Evaluasi performa cabang atau gerai", defaultDuration: 3, priority: "high", pics: ["Fajar Nugroho", "Budi Santoso"] },
    { name: "Penjajakan kerja sama dengan mitra strategis", defaultDuration: 5, priority: "medium", pics: ["Rudi Hermawan", "Ayuningtyas"] },
    { name: "Presentasi penawaran kepada klien besar", defaultDuration: 2, priority: "high", pics: ["Wati Rohmawati", "Budi Santoso"] },
    { name: "Riset tren pasar untuk produk unggulan", defaultDuration: 4, priority: "medium", pics: ["Siti Rahayu", "Mega Octavia"] },
    { name: "Penyusunan rencana ekspansi usaha", defaultDuration: 5, priority: "medium", pics: ["Joko Salim", "Diah Kusumawardani"] },
  ],
  Operasional: [
    { name: "Pengawasan proses produksi harian", defaultDuration: 1, priority: "high", pics: ["Rina Susilowati", "Hendra Kusuma"] },
    { name: "Pengecekan kualitas hasil produksi", defaultDuration: 2, priority: "high", pics: ["Rina Susilowati", "Wati Rohmawati"] },
    { name: "Pemeliharaan mesin dan peralatan produksi", defaultDuration: 3, priority: "high", pics: ["Fajar Nugroho", "Doni Prasetyo"] },
    { name: "Pengadaan bahan baku dari pemasok", defaultDuration: 3, priority: "high", pics: ["Rudi Hermawan", "Hendra Kusuma"] },
    { name: "Pengelolaan jadwal produksi mingguan", defaultDuration: 2, priority: "medium", pics: ["Rina Susilowati", "Mega Octavia"] },
    { name: "Pengaturan jadwal pengiriman barang ke pelanggan", defaultDuration: 2, priority: "medium", pics: ["Rudi Hermawan", "Doni Prasetyo"] },
    { name: "Peninjauan stok gudang dan reorder bahan", defaultDuration: 2, priority: "medium", pics: ["Ayuningtyas", "Lisa Permata"] },
    { name: "Evaluasi dan pembaruan prosedur kerja", defaultDuration: 4, priority: "low", pics: ["Siti Rahayu", "Rina Susilowati"] },
  ],
  Keuangan: [
    { name: "Rekonsiliasi laporan keuangan bulanan", defaultDuration: 3, priority: "high", pics: ["Fajar Nugroho", "Lisa Permata"] },
    { name: "Evaluasi realisasi anggaran vs rencana", defaultDuration: 3, priority: "high", pics: ["Fajar Nugroho", "Mega Octavia"] },
    { name: "Pengelolaan piutang dan tagihan pelanggan", defaultDuration: 3, priority: "high", pics: ["Fajar Nugroho", "Rudi Hermawan"] },
    { name: "Monitoring pengeluaran operasional", defaultDuration: 2, priority: "medium", pics: ["Fajar Nugroho", "Rina Susilowati"] },
    { name: "Penyusunan laporan keuangan triwulan", defaultDuration: 4, priority: "high", pics: ["Lisa Permata", "Fajar Nugroho"] },
    { name: "Evaluasi harga jual produk dan margin", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Fajar Nugroho"] },
    { name: "Perencanaan kebutuhan modal kerja", defaultDuration: 4, priority: "medium", pics: ["Budi Santoso", "Fajar Nugroho"] },
    { name: "Negosiasi fasilitas kredit dengan bank", defaultDuration: 5, priority: "medium", pics: ["Lisa Permata", "Rina Susilowati"] },
  ],
  "SDM": [
    { name: "Seleksi dan penerimaan karyawan baru", defaultDuration: 7, priority: "high", pics: ["Siti Rahayu", "Rina Susilowati"] },
    { name: "Orientasi dan onboarding karyawan baru", defaultDuration: 3, priority: "high", pics: ["Siti Rahayu", "Budi Santoso"] },
    { name: "Pelatihan teknis sesuai bidang kerja", defaultDuration: 5, priority: "medium", pics: ["Siti Rahayu"] },
    { name: "Penilaian kinerja karyawan semesteran", defaultDuration: 4, priority: "high", pics: ["Siti Rahayu", "Rina Susilowati"] },
    { name: "Pengelolaan jadwal kerja dan shift", defaultDuration: 2, priority: "medium", pics: ["Siti Rahayu"] },
    { name: "Peninjauan besaran gaji dan tunjangan", defaultDuration: 4, priority: "high", pics: ["Siti Rahayu", "Fajar Nugroho"] },
    { name: "Penanganan permasalahan disiplin karyawan", defaultDuration: 3, priority: "medium", pics: ["Budi Santoso", "Siti Rahayu"] },
    { name: "Program apresiasi dan penghargaan karyawan", defaultDuration: 3, priority: "low", pics: ["Siti Rahayu", "Budi Santoso"] },
  ],
  "Marketing & Sales": [
    { name: "Promosi produk di media sosial", defaultDuration: 3, priority: "high", pics: ["Mega Octavia", "Ayuningtyas"] },
    { name: "Kunjungan dan follow-up ke pelanggan tetap", defaultDuration: 3, priority: "high", pics: ["Hendra Kusuma", "Ayuningtyas"] },
    { name: "Penawaran produk kepada calon pelanggan baru", defaultDuration: 4, priority: "high", pics: ["Ayuningtyas", "Hendra Kusuma"] },
    { name: "Pembuatan brosur dan materi promosi", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia"] },
    { name: "Mengikuti pameran dagang atau bazaar", defaultDuration: 4, priority: "medium", pics: ["Mega Octavia", "Rudi Hermawan"] },
    { name: "Evaluasi harga dan penawaran kompetitor", defaultDuration: 3, priority: "medium", pics: ["Mega Octavia", "Budi Santoso"] },
    { name: "Program diskon dan promo pelanggan setia", defaultDuration: 5, priority: "medium", pics: ["Mega Octavia"] },
    { name: "Pembuatan laporan penjualan bulanan", defaultDuration: 2, priority: "medium", pics: ["Hendra Kusuma", "Rina Susilowati"] },
  ],
  "Customer Experience": [
    { name: "Penanganan keluhan dan komplain pelanggan", defaultDuration: 2, priority: "high", pics: ["Rudi Hermawan"] },
    { name: "Follow-up kepuasan pelanggan setelah pembelian", defaultDuration: 3, priority: "high", pics: ["Rudi Hermawan", "Fajar Nugroho"] },
    { name: "Survei kebutuhan dan harapan pelanggan", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan"] },
    { name: "Peningkatan kecepatan respon layanan", defaultDuration: 4, priority: "high", pics: ["Rudi Hermawan", "Fajar Nugroho"] },
    { name: "Pembuatan panduan dan FAQ produk", defaultDuration: 3, priority: "medium", pics: ["Rudi Hermawan", "Ayuningtyas"] },
    { name: "Pengelolaan ulasan dan testimoni pelanggan", defaultDuration: 2, priority: "medium", pics: ["Rudi Hermawan", "Mega Octavia"] },
    { name: "Peningkatan layanan purna jual", defaultDuration: 4, priority: "high", pics: ["Rudi Hermawan"] },
    { name: "Program membership untuk pelanggan setia", defaultDuration: 5, priority: "low", pics: ["Fajar Nugroho", "Rudi Hermawan"] },
  ],
}

const FOCUS_WEIGHTS: Record<FocusArea, Record<string, number>> = {
  traffic: {
    "Marketing & Sales": 3.0,
    "Customer Experience": 1.5,
    "Business Development": 1.0,
  },
  conversion: {
    "Marketing & Sales": 2.5,
    "Customer Experience": 2.0,
    "Business Development": 1.5,
  },
  operasional: {
    Operasional: 3.0,
    "SDM": 1.5,
    "Keuangan": 1.0,
  },
  keuangan: {
    Keuangan: 3.0,
    Operasional: 1.5,
    "Business Development": 1.0,
  },
  SDM: {
    "SDM": 3.0,
    Operasional: 1.5,
    "Customer Experience": 1.0,
  },
  customer: {
    "Customer Experience": 3.0,
    "Marketing & Sales": 2.0,
    "SDM": 1.0,
  },
  growth: {
    "Business Development": 2.0,
    "Marketing & Sales": 2.0,
    Operasional: 1.5,
    Keuangan: 1.0,
  },
}

const CATEGORY_NAMES = [
  "Business Development",
  "Operasional",
  "Keuangan",
  "SDM",
  "Marketing & Sales",
  "Customer Experience",
]

export interface GeneratorInput {
  startDate: Date
  teamSize: number
  focusArea: FocusArea
  target?: string
}

function getWeightedCategories(focusArea: FocusArea): Array<{ category: string; weight: number }> {
  const weights = FOCUS_WEIGHTS[focusArea]
  return CATEGORY_NAMES.map((category) => ({
    category,
    weight: weights[category] || 1.0,
  })).sort((a, b) => b.weight - a.weight)
}

function selectActivities(
  categories: Array<{ category: string; weight: number }>,
  targetCount: number
): { category: string; activity: { name: string; defaultDuration: number; priority: Priority; pics: string[] } }[] {
  const selected: { category: string; activity: { name: string; defaultDuration: number; priority: Priority; pics: string[] } }[] = []
  const usedActivities = new Set<string>()

  const baseCountPerCategory = Math.floor(targetCount / categories.length)
  let remainder = targetCount % categories.length

  for (const { category, weight } of categories) {
    const pool = ACTIVITY_POOLS[category]
    if (!pool) continue

    let count = baseCountPerCategory
    if (remainder > 0) {
      count += Math.ceil(weight * remainder / 3)
      remainder -= Math.ceil(weight * remainder / 3)
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    let added = 0

    for (const activity of shuffled) {
      if (added >= count) break
      const key = `${category}:${activity.name}`
      if (usedActivities.has(key)) continue

      selected.push({ category, activity })
      usedActivities.add(key)
      added++
    }
  }

  return selected.sort(() => Math.random() - 0.5).slice(0, targetCount)
}

function calculateParallelActivities(
  activities: { category: string; activity: { name: string; defaultDuration: number; priority: Priority; pics: string[] } }[],
  maxParallel: number
): number[] {
  const pool = [...activities]
  const assignments: number[] = []

  for (let i = 0; i < pool.length; i++) {
    const dayOffset = Math.floor(i / maxParallel)
    assignments.push(dayOffset)
  }

  return assignments
}

export function generateActivityPlan(input: GeneratorInput): Activity[] {
  const { startDate, teamSize, focusArea, target } = input
  const targetCount = Math.min(Math.max(15, teamSize * 3), 25)

  const weightedCategories = getWeightedCategories(focusArea)
  const selectedData = selectActivities(weightedCategories, targetCount)

  const maxParallel = Math.max(2, Math.min(teamSize, 6))
  const dayOffsets = calculateParallelActivities(selectedData, maxParallel)

  const activities: Activity[] = selectedData.map((item, index) => {
    const { activity, category } = item
    const dayOffset = dayOffsets[index]
    const start = addDays(startDate, dayOffset)
    const duration = activity.defaultDuration
    const end = addDays(start, duration)

    const picOptions = activity.pics.length > 0 ? activity.pics : PIC_NAMES
    const pic = picOptions[index % picOptions.length]

    return {
      id: `ACT-${String(index + 1).padStart(3, "0")}`,
      name: activity.name,
      category,
      startDate: start,
      endDate: end,
      duration,
      priority: activity.priority,
      pic,
    }
  })

  return activities.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy")
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Business Development": "bg-blue-100 text-blue-800",
    Operasional: "bg-purple-100 text-purple-800",
    Keuangan: "bg-green-100 text-green-800",
    SDM: "bg-yellow-100 text-yellow-800",
    "Marketing & Sales": "bg-pink-100 text-pink-800",
    "Customer Experience": "bg-cyan-100 text-cyan-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}