"use client"

import { useState } from "react"
import { Zap, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Activity, Priority, FocusArea, GeneratorInput } from "@/lib/generator"
import { formatDate } from "@/lib/generator"

const CATEGORIES = [
  "Business Development",
  "Operasional",
  "Keuangan",
  "SDM",
  "Marketing & Sales",
  "Customer Experience",
]

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
  { value: "low", label: "Rendah" },
]

const FOCUS_OPTIONS: { value: FocusArea; label: string }[] = [
  { value: "traffic", label: "Traffic / Pengunjung" },
  { value: "conversion", label: "Conversion / Penjualan" },
  { value: "operasional", label: "Operasional" },
  { value: "keuangan", label: "Keuangan" },
  { value: "SDM", label: "SDM / HR" },
  { value: "customer", label: "Customer Experience" },
  { value: "growth", label: "Growth Umum" },
]

interface FormInputProps {
  activities: Activity[]
  onAddActivity: (activity: Activity) => void
  onRemoveActivity: (id: string) => void
  onGenerateAuto: (input: GeneratorInput) => void
}

export function FormInput({ 
  activities, 
  onAddActivity, 
  onRemoveActivity,
  onGenerateAuto 
}: FormInputProps) {
  const [mode, setMode] = useState<"auto" | "manual">("manual")

  const [startDate, setStartDate] = useState<string>("")
  const [focusArea, setFocusArea] = useState<FocusArea>("growth")

  const [newName, setNewName] = useState<string>("")
  const [newCategory, setNewCategory] = useState<string>("")
  const [newStartDate, setNewStartDate] = useState<string>("")
  const [newDuration, setNewDuration] = useState<string>("1")
  const [newPriority, setNewPriority] = useState<Priority>("medium")
  const [newPic, setNewPic] = useState<string>("")

  const handleAutoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate) {
      alert("Silakan pilih tanggal mulai")
      return
    }
    onGenerateAuto({
      startDate: new Date(startDate),
      teamSize: 3,
      focusArea,
    })
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newName || !newCategory || !newStartDate || !newPic) {
      alert("Mohon lengkapi semua field")
      return
    }

    const start = new Date(newStartDate)
    const duration = parseInt(newDuration) || 1
    const end = new Date(start)
    end.setDate(end.getDate() + duration)

    const newActivity: Activity = {
      id: `ACT-${String(activities.length + 1).padStart(3, "0")}`,
      name: newName,
      category: newCategory,
      startDate: start,
      endDate: end,
      duration,
      priority: newPriority,
      pic: newPic,
    }

    onAddActivity(newActivity)

    setNewName("")
    setNewStartDate("")
    setNewDuration("1")
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-primary" />
          Input Aktivitas
        </CardTitle>
        <p className="text-xs text-muted-foreground">Tambah aktivitas secara manual atau generate otomatis</p>
      </CardHeader>
      <CardContent>
        <div className="flex p-1 rounded-lg bg-muted mb-4">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "manual"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("manual")}
          >
            <Plus className="h-3.5 w-3.5" />
            Manual
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "auto"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("auto")}
          >
            <Zap className="h-3.5 w-3.5" />
            Auto
          </button>
        </div>

        {mode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="newName">Nama Aktivitas *</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Meeting tim marketing"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newCategory">Kategori *</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger id="newCategory">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="newStartDate">Tanggal Mulai *</Label>
                <Input
                  id="newStartDate"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newDuration">Durasi (hari)</Label>
                <Input
                  id="newDuration"
                  type="number"
                  min="1"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPriority">Prioritas</Label>
              <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Priority)}>
                <SelectTrigger id="newPriority">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPic">PIC *</Label>
              <Input
                id="newPic"
                type="text"
                value={newPic}
                onChange={(e) => setNewPic(e.target.value)}
                placeholder="Nama PIC"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Aktivitas
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAutoSubmit} className="space-y-3">
            <div className="p-3 rounded-lg border text-sm" style={{ backgroundColor: "#133622" + "0d", borderColor: "#133622" + "30" }}>
              <p className="font-semibold text-foreground mb-0.5">Contoh Aktivitas</p>
              <p className="text-xs text-muted-foreground">
                Menampilkan contoh aktivitas sebagai referensi. Jangan digunakan langsung — sesuaikan dengan kondisi bisnis Anda.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="autoStartDate">Tanggal Mulai *</Label>
              <input
                id="autoStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Lihat Contoh
            </Button>
          </form>
        )}

        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Aktivitas</h4>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: "#133622" }}>
                {activities.length}
              </span>
            </div>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {activities.map((activity, index) => {
                const dot =
                  activity.priority === "high"
                    ? "bg-red-500"
                    : activity.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg text-xs group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{index + 1}. {activity.name}</p>
                        <p className="text-muted-foreground truncate">
                          {formatDate(activity.startDate)} • {activity.pic}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => onRemoveActivity(activity.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}