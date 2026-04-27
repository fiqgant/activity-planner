import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpen,
  Target,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Star,
  FileText,
  Calendar,
  User,
  Flag,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react"

const GOAL_GUIDE = [
  {
    goal: "Meningkatkan Penjualan & Omset",
    examples: ["Capai omset Rp 50 juta/bulan", "Tambah 20 pelanggan baru", "Tingkatkan konversi 30%"],
    borderColor: "border-pink-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    Icon: TrendingUp,
    categories: [
      {
        label: "A · Marketing",
        dot: "bg-pink-500",
        activities: [
          "Promosi produk di media sosial (Instagram, TikTok)",
          "Penawaran produk kepada calon pelanggan baru",
          "Kunjungan dan follow-up ke pelanggan tetap",
          "Membuat program giveaway / promo mingguan",
          "Melakukan riset pasar terhadap produk baru",
          "Mengumpulkan testimoni pelanggan",
        ],
      },
      {
        label: "B · Keuangan",
        dot: "bg-green-500",
        activities: [
          "Evaluasi harga jual produk dan margin",
          "Membuat laporan penjualan mingguan",
        ],
      },
    ],
  },
  {
    goal: "Mengelola Keuangan & Mencapai Profit",
    examples: ["Laba bersih 20% per bulan", "Efisiensi biaya operasional 15%", "Cashflow lebih tertib"],
    borderColor: "border-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    Icon: DollarSign,
    categories: [
      {
        label: "B · Keuangan",
        dot: "bg-green-500",
        activities: [
          "Menghitung HPP dan margin produk",
          "Membuat anggaran biaya operasional & marketing",
          "Mencatat pemasukan dan pengeluaran harian",
          "Rekonsiliasi laporan keuangan bulanan",
          "Monitoring pengeluaran operasional",
          "Evaluasi harga jual produk dan margin",
        ],
      },
      {
        label: "C · Operasional",
        dot: "bg-purple-500",
        activities: [
          "Mencari supplier lebih terjangkau untuk menekan HPP",
          "Evaluasi laporan penjualan mingguan",
        ],
      },
    ],
  },
  {
    goal: "Meningkatkan Kapasitas & Kualitas Produksi",
    examples: ["Produksi 100pcs/minggu", "Zero defect produk", "SOP berjalan konsisten"],
    borderColor: "border-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    Icon: Package,
    categories: [
      {
        label: "C · Operasional",
        dot: "bg-purple-500",
        activities: [
          "Membuat SOP produksi yang baku",
          "Mencari 3 opsi supplier lebih terjangkau",
          "Membeli bahan baku & peralatan produksi",
          "Pengecekan kualitas hasil produksi",
          "Pemeliharaan mesin dan peralatan",
          "Pengelolaan jadwal pengiriman barang",
        ],
      },
      {
        label: "B · Keuangan",
        dot: "bg-green-500",
        activities: [
          "Menyusun anggaran biaya produksi",
          "Monitoring pengeluaran operasional",
        ],
      },
    ],
  },
  {
    goal: "Membangun & Memperkuat Brand",
    examples: ["Brand dikenal di komunitas lokal", "1.000 followers baru", "Konsistensi identitas merek"],
    borderColor: "border-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    Icon: Star,
    categories: [
      {
        label: "A · Marketing",
        dot: "bg-pink-500",
        activities: [
          "Membuat akun media sosial sebagai channel promosi",
          "Merancang moodboard konten media sosial",
          "Membuat konten kalender bulanan",
          "Merancang promo khusus hari spesial",
          "Mengumpulkan testimoni & ulasan pelanggan",
          "Melakukan evaluasi strategi pemasaran",
        ],
      },
    ],
  },
]

export function GuidePanel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Panduan Membuat Activity Plan yang Baik
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Goals → Aktivitas */}
        <section>
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-foreground">
            <Target className="h-4 w-4" />
            Goals → Aktivitas yang Mendukung
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Tentukan Goals bisnis Anda terlebih dahulu, lalu pilih aktivitas di bawah ini yang relevan untuk mencapainya.
          </p>
          <div className="space-y-4">
            {GOAL_GUIDE.map(({ goal, examples, borderColor, bgColor, textColor, Icon, categories }) => (
              <div key={goal} className={`rounded-lg border-l-4 ${borderColor} ${bgColor} p-3`}>
                <div className={`flex items-center gap-2 font-semibold text-sm mb-1 ${textColor}`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {goal}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {examples.map((ex) => (
                    <span key={ex} className={`text-xs px-2 py-0.5 rounded-full bg-white/70 ${textColor} border border-current/20`}>
                      {ex}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  {categories.map(({ label, dot, activities }) => (
                    <div key={label}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className="text-xs font-semibold text-foreground">{label}</span>
                      </div>
                      <ul className="space-y-0.5 pl-3.5">
                        {activities.map((act) => (
                          <li key={act} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t" />

        <section className="pl-4 border-l-4 border-green-600">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-green-700">
            <FileText className="h-4 w-4" />
            Apa Itu Activity Plan?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Activity Plan adalah dokumen rencana kerja yang menjabarkan aktivitas-aktivitas
            yang perlu dilakukan dalam periode tertentu untuk mencapai tujuan bisnis.
            Dokumen ini membantu tim mengetahui apa yang harus dilakukan, siapa yang bertanggung jawab,
            dan kapan harus selesai.
          </p>
        </section>

        <section className="pl-4 border-l-4 border-blue-600">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-blue-700">
            <Target className="h-4 w-4" />
            Prinsip Activity Plan yang Baik (SMART)
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Specific</strong> — Nama aktivitas jelas dan detail, bukan umum</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Measurable</strong> — Ada parameter untuk mengukur keberhasilan</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Achievable</strong> — Realistis dengan sumber daya yang ada</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Relevant</strong> — Berkaitan langsung dengan Goals bisnis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Time-bound</strong> — Ada deadline yang jelas</span>
            </li>
          </ul>
        </section>

        <section className="pl-4 border-l-4 border-purple-600">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-purple-700">
            <Clock className="h-4 w-4" />
            Cara Menulis Nama Aktivitas yang Baik
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-500">✗</span>
              <span className="italic">"Meeting"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">✓</span>
              <span>"Presentasi penawaran produk ke PT Maju Jaya"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-500">✗</span>
              <span className="italic">"Follow up"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">✓</span>
              <span>"Follow-up kontrak dengan distributor wilayah Surabaya"</span>
            </li>
          </ul>
        </section>

        <section className="pl-4 border-l-4 border-amber-500">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-amber-700">
            <Calendar className="h-4 w-4" />
            Cara Menentukan Durasi yang Tepat
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>Durasi standar: 1–7 hari untuk aktivitas rutin</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>Hindari durasi lebih dari 14 hari tanpa milestone</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>Pertimbangkan hari libur dan hari merah</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>Parallel task maksimal 3–4 aktivitas sekaligus</span>
            </li>
          </ul>
        </section>

        <section className="pl-4 border-l-4 border-rose-500">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-rose-700">
            <Flag className="h-4 w-4" />
            Cara Menentukan Prioritas
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <Flag className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-red-700">TINGGI</span>
                <p className="text-muted-foreground mt-0.5">Langsung berdampak pada bisnis atau deadline kritis. Kerjakan segera.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <Flag className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-orange-700">SEDANG</span>
                <p className="text-muted-foreground mt-0.5">Penting tapi tidak mendesak. Jadwalkan dalam minggu ini.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <Flag className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-green-700">RENDAH</span>
                <p className="text-muted-foreground mt-0.5">Bermanfaat tapi bisa ditunda. Lakukan saat waktu memungkinkan.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pl-4 border-l-4 border-teal-500">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-teal-700">
            <User className="h-4 w-4" />
            Cara Memilih PIC yang Tepat
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600 flex-shrink-0" />
              <span>Pilih orang yang memiliki keahlian sesuai aktivitas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600 flex-shrink-0" />
              <span>Pertimbangkan beban kerja PIC (hindari overload)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600 flex-shrink-0" />
              <span>1 PIC per aktivitas untuk kejelasan tanggung jawab</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600 flex-shrink-0" />
              <span>Untuk aktivitas tim, tunjuk koordinator sebagai PIC</span>
            </li>
          </ul>
        </section>

        <section className="pl-4 border-l-4 border-indigo-500">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-indigo-700">
            <Star className="h-4 w-4" />
            Tips Tambahan
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600 flex-shrink-0" />
              <span>Review plan bersama tim di awal periode untuk alignment</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600 flex-shrink-0" />
              <span>Update progress setiap minggu dan dokumentasikan</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600 flex-shrink-0" />
              <span>Gunakan Gantt Chart untuk visualisasi timeline</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600 flex-shrink-0" />
              <span>Export ke Excel untuk sharing ke stakeholder</span>
            </li>
          </ul>
        </section>

      </CardContent>
    </Card>
  )
}
