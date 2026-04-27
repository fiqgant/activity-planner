"use client"

import { useState, useRef } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Calendar, Clock, User, Flag, Trash2, Pencil, Check, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Activity, Priority, PlanInfo } from "@/lib/generator"
import { formatDate, CATEGORY_NAMES } from "@/lib/generator"
import { exportToExcel } from "@/lib/excel-export"
import { parseExcelActivities } from "@/lib/excel-import"

interface ActivityTableProps {
  activities: Activity[]
  planInfo?: PlanInfo
  onDelete?: (id: string) => void
  onUpdate?: (activity: Activity) => void
  onImport?: (activities: Activity[]) => void
}

type SortField = "name" | "category" | "startDate" | "endDate" | "duration" | "priority" | "pic"
type SortDirection = "asc" | "desc"

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
  { value: "low", label: "Rendah" },
]

export function ActivityTable({ activities, planInfo, onDelete, onUpdate, onImport }: ActivityTableProps) {
  const [sortField, setSortField] = useState<SortField>("startDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Activity>>({})
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedActivities = [...activities].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "name":        comparison = a.name.localeCompare(b.name); break
      case "category":    comparison = a.category.localeCompare(b.category); break
      case "startDate":   comparison = a.startDate.getTime() - b.startDate.getTime(); break
      case "endDate":     comparison = a.endDate.getTime() - b.endDate.getTime(); break
      case "duration":    comparison = a.duration - b.duration; break
      case "priority": {
        const order: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
        comparison = order[a.priority] - order[b.priority]
        break
      }
      case "pic": comparison = a.pic.localeCompare(b.pic); break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1" />
    return sortDirection === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />
  }

  const getPriorityVariant = (priority: Priority) => priority as "high" | "medium" | "low"

  const handleDownload = async () => {
    await exportToExcel(activities, "activity-plan", planInfo)
  }

  const startEdit = (activity: Activity) => {
    setEditingId(activity.id)
    setEditForm({
      name: activity.name,
      category: activity.category,
      startDate: activity.startDate,
      endDate: activity.endDate,
      duration: activity.duration,
      priority: activity.priority,
      pic: activity.pic,
      budget: activity.budget ?? "",
      note: activity.note ?? "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = (originalActivity: Activity) => {
    if (!editForm.name || !editForm.category || !editForm.pic) {
      alert("Mohon lengkapi field yang wajib")
      return
    }
    const updated: Activity = {
      ...originalActivity,
      name: editForm.name,
      category: editForm.category,
      startDate: editForm.startDate ? new Date(editForm.startDate) : originalActivity.startDate,
      endDate: editForm.endDate ? new Date(editForm.endDate) : originalActivity.endDate,
      duration: editForm.duration || originalActivity.duration,
      priority: editForm.priority || originalActivity.priority,
      pic: editForm.pic,
      budget: (editForm.budget as string) || undefined,
      note: (editForm.note as string) || undefined,
    }
    onUpdate?.(updated)
    setEditingId(null)
    setEditForm({})
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("File harus format Excel (.xlsx atau .xls)")
      return
    }
    setIsImporting(true)
    try {
      const imported = await parseExcelActivities(file)
      onImport?.(imported)
      alert(`Berhasil import ${imported.length} aktivitas`)
    } catch (err) {
      console.error("Import error:", err)
      alert("Gagal import file. Pastikan format Excel valid.")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  if (activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Plan
          </CardTitle>
          <Button onClick={handleImportClick} size="sm" disabled={isImporting} style={{ backgroundColor: "#133622" }}>
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Excel"}
          </Button>
          <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">Belum ada aktivitas</p>
            <p className="text-sm text-muted-foreground mb-6">Tambah aktivitas manual atau generate contoh dari panel kiri</p>
            <Button onClick={handleImportClick} disabled={isImporting} style={{ backgroundColor: "#133622" }}>
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Excel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Activity Plan
          {planInfo?.team && (
            <span className="text-sm font-normal text-muted-foreground ml-1">— {planInfo.team}</span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={handleImportClick} size="sm" variant="outline" disabled={isImporting}>
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Excel"}
          </Button>
          <Button onClick={handleDownload} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </div>
        <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground w-8">#</th>
                <th className="text-left py-3 px-2 font-medium">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("name")}>
                    Aktivitas {getSortIcon("name")}
                  </button>
                </th>
                <th className="text-left py-3 px-2 font-medium">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("category")}>
                    Kategori {getSortIcon("category")}
                  </button>
                </th>
                <th className="text-left py-3 px-2 font-medium">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("pic")}>
                    PIC {getSortIcon("pic")}
                  </button>
                </th>
                <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Budget</th>
                <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Note</th>
                <th className="text-left py-3 px-2 font-medium">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("startDate")}>
                    Mulai {getSortIcon("startDate")}
                  </button>
                </th>
                <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("duration")}>
                    Durasi {getSortIcon("duration")}
                  </button>
                </th>
                <th className="text-left py-3 px-2 font-medium">
                  <button className="flex items-center hover:text-primary transition-colors" onClick={() => handleSort("priority")}>
                    Prioritas {getSortIcon("priority")}
                  </button>
                </th>
                {(onDelete || onUpdate) && (
                  <th className="text-left py-3 px-2 font-medium w-20 text-muted-foreground">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map((activity, rowIndex) => {
                const isEditing = editingId === activity.id
                return (
                  <tr key={activity.id} className={`border-b hover:bg-primary/5 transition-colors ${rowIndex % 2 === 1 ? "bg-muted/20" : ""}`}>
                    <td className="py-2 px-2 text-muted-foreground text-xs">{rowIndex + 1}</td>

                    <td className="py-2 px-2">
                      {isEditing ? (
                        <Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-8 text-sm" />
                      ) : (
                        <span className="font-medium">{activity.name}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {isEditing ? (
                        <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORY_NAMES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">{activity.category}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {isEditing ? (
                        <Input value={editForm.pic || ""} onChange={(e) => setEditForm({ ...editForm, pic: e.target.value })} className="h-8 text-sm" placeholder="Nama PIC" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {activity.pic}
                        </div>
                      )}
                    </td>

                    <td className="py-2 px-2 hidden md:table-cell">
                      {isEditing ? (
                        <Input value={(editForm.budget as string) || ""} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} className="h-8 text-sm" placeholder="Budget" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{activity.budget || "—"}</span>
                      )}
                    </td>

                    <td className="py-2 px-2 hidden md:table-cell">
                      {isEditing ? (
                        <Input value={(editForm.note as string) || ""} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} className="h-8 text-sm" placeholder="Note" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{activity.note || "—"}</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editForm.startDate ? new Date(editForm.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value)
                            const dur = editForm.duration || activity.duration
                            const endDate = new Date(newDate)
                            endDate.setDate(endDate.getDate() + dur)
                            setEditForm({ ...editForm, startDate: newDate, endDate })
                          }}
                          className="h-8 text-sm"
                        />
                      ) : (
                        formatDate(activity.startDate)
                      )}
                    </td>

                    <td className="py-2 px-2 hidden lg:table-cell">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="1"
                          value={editForm.duration || activity.duration}
                          onChange={(e) => {
                            const dur = parseInt(e.target.value) || 1
                            const start = editForm.startDate ? new Date(editForm.startDate) : activity.startDate
                            const endDate = new Date(start)
                            endDate.setDate(endDate.getDate() + dur)
                            setEditForm({ ...editForm, duration: dur, endDate })
                          }}
                          className="h-8 text-sm w-16"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {activity.duration}h
                        </div>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {isEditing ? (
                        <Select value={editForm.priority} onValueChange={(v) => setEditForm({ ...editForm, priority: v as Priority })}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={getPriorityVariant(activity.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {activity.priority === "high" ? "TINGGI" : activity.priority === "medium" ? "SEDANG" : "RENDAH"}
                        </Badge>
                      )}
                    </td>

                    {(onDelete || onUpdate) && (
                      <td className="py-2 px-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => saveEdit(activity)}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={cancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {onUpdate && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(activity)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(activity.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Total: {activities.length} aktivitas
        </p>
      </CardContent>
    </Card>
  )
}
