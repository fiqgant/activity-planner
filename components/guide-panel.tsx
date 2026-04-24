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
} from "lucide-react"

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
        <section className="pl-4 border-l-4 border-green-600">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-green-700">
            <FileText className="h-4 w-4" />
            Apa Itu Activity Plan?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Activity Plan adalah dokumen rencana kerja yang menjabarkan aktivitas-aktivitas 
            yang perlu dilakukan dalam periode tertentu untuk mencapai tujuan bisnis. 
            Dokumen ini membantu tim mengetahui apa yang harus dilakukan, siapa负责, 
            dan kapan harus selesai.
          </p>
        </section>

        <section className="pl-4 border-l-4 border-blue-600">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-blue-700">
            <Target className="h-4 w-4" />
            Prinsip Activity Plan yang Baik
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Specific (Spesifik)</strong> - Nama aktivitas jelas dan detail, bukan umum</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Measurable (Terukur)</strong> - Ada parameter untuk mengukur keberhasilan</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Achievable (Dapat Dicapai)</strong> - Realistis dengan sumber daya yang ada</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Relevant (Relevan)</strong> - Berkaitan langsung dengan tujuan bisnis</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Time-bound (Berbatas Waktu)</strong> - Ada deadline yang jelas</span>
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
              <span className="font-bold text-red-500">❌</span>
              <span className="italic">"Meeting"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">✓</span>
              <span>"Presentasi penawaran produk ke PT Maju Jaya"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-red-500">❌</span>
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
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
              <span>Durasi standar: 1-7 hari untuk aktivitas rutin</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
              <span>Hindari durasi lebih dari 14 hari tanpa milestone</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
              <span>Pertimbangkan waktu yang hilang (libur, hari merah)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500" />
              <span>Parallel task maksimal 3-4 aktivitas sekaligus</span>
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
              <Flag className="h-4 w-4 mt-0.5 text-red-600" />
              <div>
                <span className="font-semibold text-red-700">TINGGI (High)</span>
                <p className="text-muted-foreground mt-1">Aktivitas yang直接影响 bisnis atau deadline kritis. Perlu dikerjakan segera.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <Flag className="h-4 w-4 mt-0.5 text-orange-600" />
              <div>
                <span className="font-semibold text-orange-700">SEDANG (Medium)</span>
                <p className="text-muted-foreground mt-1">Aktivitas penting tapi tidak mendesak. Jadwalkan dalam minggu ini.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <Flag className="h-4 w-4 mt-0.5 text-green-600" />
              <div>
                <span className="font-semibold text-green-700">RENDAH (Low)</span>
                <p className="text-muted-foreground mt-1">Aktivitas yang有益 tapi bisa ditunda jika perlu. Lakukan saat waktu memungkinkan.</p>
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
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600" />
              <span>Pilih orang yang memiliki keahlian sesuai aktivitas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600" />
              <span>Pertimbangkan beban kerja PIC (hindari overload)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600" />
              <span>1 PIC per aktivitas untuk klarifikasi tanggung jawab</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-teal-600" />
              <span>Untuk aktivitas tim, pilih koordinator sebagai PIC</span>
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
              <Users className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>Review plan bersama tim di awal periode untuk alignment</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>Update progress setiap minggu dan dokumentasikan</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>Gunakan Gantt Chart untuk visualisasi timeline</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>Export ke Excel untuk sharing ke stakeholder</span>
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}