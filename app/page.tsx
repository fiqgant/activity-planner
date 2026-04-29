"use client"

import { useState, useRef } from "react"
import { Plus, BarChart3, BookOpen, ListTodo, Zap, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/form-input"
import { ActivityTable } from "@/components/activity-table"
import { GanttChart } from "@/components/gantt-chart"
import { GuidePanel } from "@/components/guide-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateActivityPlan, type Activity, type GeneratorInput, type PlanInfo } from "@/lib/generator"
import { parseExcelActivities } from "@/lib/excel-import"

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [planInfo, setPlanInfo] = useState<PlanInfo>({ team: "", business: "", brand: "", goals: "" })
  const [hasActivities, setHasActivities] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [activeTab, setActiveTab] = useState("guide")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddActivity = (activity: Activity) => {
    setActivities((prev) => [...prev, activity])
    setHasActivities(true)
  }

  const handleRemoveActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    if (activities.length <= 1) {
      setHasActivities(false)
    }
  }

  const handleGenerateAuto = (input: GeneratorInput) => {
    const generated = generateActivityPlan(input)
    setActivities(generated)
    setHasActivities(true)
    setPlanInfo((prev) => ({
      team: prev.team || "WBI PRIDE",
      business: prev.business || "Nama Guild Kamu",
      brand: prev.brand || "Nama Usaha",
      goals: prev.goals || "Membangun awareness produk baru",
    }))
  }

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === updatedActivity.id ? updatedActivity : a))
    )
  }

  const handleImportActivities = (imported: Activity[]) => {
    setActivities(imported)
    setHasActivities(true)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

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
      handleImportActivities(imported)
      alert(`Berhasil import ${imported.length} aktivitas`)
    } catch (err) {
      console.error("Import error:", err)
      alert("Gagal import file. Pastikan format Excel valid.")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col page-bg">
      {/* Header */}
      <header
        className="relative overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #091a0f 0%, #133622 50%, #1d5035 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #AC7B2E 0%, transparent 70%)" }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px opacity-[0.08]"
            style={{ background: "linear-gradient(to right, transparent, #AC7B2E 40%, #AC7B2E 60%, transparent)" }} />
        </div>

        <div className="container mx-auto px-6 py-3 relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-md shadow-black/25 flex-shrink-0">
              <img src="/logo/wbi.png"   alt="WBI"   className="h-11 w-11 object-contain" />
              <div className="w-px h-8 bg-gray-200" />
              <img src="/logo/wbiic.png" alt="WBIIC" className="h-11 w-11 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight tracking-tight">
                Activity Plan Generator
              </h1>
              <p className="text-emerald-300/75 text-xs font-medium mt-0.5">
                WBIIC · Politeknik Wilmar Bisnis Indonesia
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-6">
              <FormInput
                activities={activities}
                planInfo={planInfo}
                onAddActivity={handleAddActivity}
                onRemoveActivity={handleRemoveActivity}
                onGenerateAuto={handleGenerateAuto}
                onPlanInfoChange={setPlanInfo}
              />
            </div>
          </aside>

          <section className="lg:col-span-9 order-1 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-5 h-11 p-1 gap-0.5 rounded-xl shadow-sm border border-border/60 bg-white/80 backdrop-blur-sm">
                <TabsTrigger
                  value="activities"
                  className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <ListTodo className="h-4 w-4" />
                  Activity Plan
                </TabsTrigger>
                <TabsTrigger
                  value="gantt"
                  className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  Gantt Chart
                </TabsTrigger>
                <TabsTrigger
                  value="guide"
                  className="flex items-center gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  Panduan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="animate-fade-in">
                <ActivityTable
                  activities={activities}
                  planInfo={planInfo}
                  onDelete={handleRemoveActivity}
                  onUpdate={handleUpdateActivity}
                  onImport={handleImportActivities}
                />
              </TabsContent>

              <TabsContent value="gantt" className="animate-fade-in">
                <GanttChart activities={activities} />
              </TabsContent>

              <TabsContent value="guide" className="animate-fade-in">
                <GuidePanel />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-auto py-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #091a0f 0%, #133622 100%)" }}
      >
        <div className="container mx-auto px-4 text-center text-xs font-semibold tracking-wide" style={{ color: "#AC7B2E" }}>
          © 2025 WBIIC — Politeknik Wilmar Bisnis Indonesia
        </div>
      </footer>
    </div>
  )
}