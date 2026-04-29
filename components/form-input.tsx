"use client"

import { useState } from "react"
import { Zap, Plus, Trash2, Building2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Activity, Priority, GeneratorInput, PlanInfo } from "@/lib/generator"
import { CATEGORY_NAMES } from "@/lib/generator"

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
  { value: "low", label: "Rendah" },
]

interface FormInputProps {
  activities: Activity[]
  planInfo: PlanInfo
  onAddActivity: (activity: Activity) => void
  onRemoveActivity: (id: string) => void
  onGenerateAuto: (input: GeneratorInput) => void
  onPlanInfoChange: (info: PlanInfo) => void
}

export function FormInput({
  activities,
  planInfo,
  onAddActivity,
  onRemoveActivity,
  onGenerateAuto,
  onPlanInfoChange,
}: FormInputProps) {
  const [mode, setMode] = useState<"auto" | "manual">("manual")
  const [startDate, setStartDate] = useState("")
  const [infoOpen, setInfoOpen] = useState(true)

  const [newName, setNewName] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newDuration, setNewDuration] = useState("1")
  const [newPriority, setNewPriority] = useState<Priority>("medium")
  const [newPic, setNewPic] = useState("")
  const [newBudget, setNewBudget] = useState("")
  const [newTarget, setNewTarget] = useState("")
  const [newNote, setNewNote] = useState("")

  const handleAutoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate) { alert("Silakan pilih tanggal mulai"); return }
    onGenerateAuto({ startDate: new Date(startDate), teamSize: 3 })
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newCategory || !newStartDate || !newPic) {
      alert("Mohon lengkapi field yang wajib (*)")
      return
    }
    const start = new Date(newStartDate)
    const duration = parseInt(newDuration) || 1
    const end = new Date(start)
    end.setDate(end.getDate() + duration)

    onAddActivity({
      id: `ACT-${String(activities.length + 1).padStart(3, "0")}`,
      name: newName, category: newCategory,
      startDate: start, endDate: end, duration,
      priority: newPriority, pic: newPic,
      budget: newBudget || undefined,
      target: newTarget || undefined,
      note: newNote || undefined,
    })
    setNewName(""); setNewCategory(""); setNewStartDate("")
    setNewDuration("1"); setNewPriority("medium"); setNewPic("")
    setNewBudget(""); setNewNote("")
  }

  return (
    <div className="space-y-3">
      {/* Info Rencana — collapsible */}
      <Card className="shadow-md shadow-black/5 border-border/60">
        <CardHeader className="pb-2 pt-4 px-4">
          <button
            type="button"
            className="flex items-center justify-between w-full"
            onClick={() => setInfoOpen(!infoOpen)}
          >
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              Info Rencana
            </CardTitle>
            {infoOpen
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </button>
        </CardHeader>
        {infoOpen && (
          <CardContent className="px-4 pb-4 space-y-2">
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="team">Team</Label>
              <Input id="team" value={planInfo.team}
                onChange={(e) => onPlanInfoChange({ ...planInfo, team: e.target.value })}
                placeholder="Contoh: WBI PRIDE" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="business">Guild</Label>
              <Input id="business" value={planInfo.business}
                onChange={(e) => onPlanInfoChange({ ...planInfo, business: e.target.value })}
                placeholder="Nama Guild Anda" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="brand">Nama Usaha</Label>
              <Input id="brand" value={planInfo.brand}
                onChange={(e) => onPlanInfoChange({ ...planInfo, brand: e.target.value })}
                placeholder="Nama usaha / bisnis Anda" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs" htmlFor="goals">Goals</Label>
              <Textarea id="goals" value={planInfo.goals}
                onChange={(e) => onPlanInfoChange({ ...planInfo, goals: e.target.value })}
                placeholder="Contoh: Membangun awareness produk baru"
                rows={2} className="resize-none text-sm" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Input Aktivitas */}
      <Card className="shadow-md shadow-black/5 border-border/60">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            Input Aktivitas
          </CardTitle>
          <p className="text-xs text-muted-foreground">Tambah manual atau lihat contoh</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex p-1 rounded-lg bg-muted mb-3">
            {(["manual", "auto"] as const).map((m) => (
              <button key={m} type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === m ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode(m)}
              >
                {m === "manual" ? <Plus className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {m === "manual" ? "Manual" : "Contoh"}
              </button>
            ))}
          </div>

          {mode === "manual" ? (
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs" htmlFor="newName">Aktivitas *</Label>
                <Input id="newName" value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama kegiatan" className="h-8 text-sm" required />
              </div>

              <div className="space-y-1">
                <Label className="text-xs" htmlFor="newCategory">Kategori *</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger id="newCategory" className="h-8 text-sm">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_NAMES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs" htmlFor="newPic">PIC *</Label>
                <Input id="newPic" value={newPic} onChange={(e) => setNewPic(e.target.value)}
                  placeholder="Nama penanggung jawab" className="h-8 text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="newBudget">Budget</Label>
                  <Input id="newBudget" value={newBudget} onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="Rp 500.000" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="newTarget">Target</Label>
                  <Input id="newTarget" value={newTarget} onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="50 pcs/minggu" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="newNote">Note</Label>
                  <Input id="newNote" value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Catatan" className="h-8 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="newStartDate">Tgl Mulai *</Label>
                  <Input id="newStartDate" type="date" value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)} className="h-8 text-sm" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="newDuration">Durasi (hari)</Label>
                  <Input id="newDuration" type="number" min="1" value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs" htmlFor="newPriority">Prioritas</Label>
                <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Priority)}>
                  <SelectTrigger id="newPriority" className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-sm">{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full h-8 text-sm mt-1">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Tambah Aktivitas
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAutoSubmit} className="space-y-3">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: "#1336220d", borderColor: "#13362230" }}>
                <p className="font-semibold text-xs text-foreground mb-0.5">Contoh Aktivitas</p>
                <p className="text-xs text-muted-foreground">
                  Generate contoh Marketing, Keuangan, Operasional. Lihat tab <strong>Panduan</strong> untuk aktivitas sesuai Goals.
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs" htmlFor="autoStartDate">Tanggal Mulai *</Label>
                <input id="autoStartDate" type="date" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} required
                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" className="w-full h-8 text-sm">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Generate Contoh
              </Button>
            </form>
          )}

          {activities.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-xs">Daftar Aktivitas</h4>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: "#133622" }}>
                  {activities.length}
                </span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {activities.map((activity, index) => {
                  const dot = activity.priority === "high" ? "bg-red-500"
                    : activity.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  return (
                    <div key={activity.id}
                      className="flex items-center justify-between p-1.5 bg-white border border-border/50 rounded-lg text-xs group hover:border-primary/30 hover:bg-emerald-50/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{index + 1}. {activity.name}</p>
                          <p className="text-muted-foreground truncate">{activity.category} · {activity.pic}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon"
                        className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
    </div>
  )
}
