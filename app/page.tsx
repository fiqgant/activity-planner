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
    <div className="min-h-screen flex flex-col">
      <header className="border-b" style={{ backgroundColor: "#133622" }}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1 rounded-xl" style={{ backgroundColor: "#FFFFFF" }}>
              <img src="/logo/wbi.png" alt="WBI" className="h-12 w-12 object-contain" />
              <img src="/logo/wbiic.png" alt="WBIIC" className="h-12 w-12 object-contain" />
            </div>
          </div>
        </div>
      </header>

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
                <TabsList className="mb-4">
                  <TabsTrigger value="activities" className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4" />
                    Activity Plan
                  </TabsTrigger>
                  <TabsTrigger value="gantt" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Gantt Chart
                  </TabsTrigger>
                  <TabsTrigger value="guide" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Panduan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activities">
                  <ActivityTable
                    activities={activities}
                    planInfo={planInfo}
                    onDelete={handleRemoveActivity}
                    onUpdate={handleUpdateActivity}
                    onImport={handleImportActivities}
                  />
                </TabsContent>

                <TabsContent value="gantt">
                  <GanttChart activities={activities} />
                </TabsContent>

                <TabsContent value="guide">
                  <GuidePanel />
                </TabsContent>
              </Tabs>
            </section>
        </div>
      </main>

      <footer className="border-t mt-auto py-4" style={{ backgroundColor: "#133622" }}>
        <div className="container mx-auto px-4 text-center text-sm" style={{ color: "#AC7B2E" }}>
          WBIIC - Politeknik Wilmar Bisnis Indonesia
        </div>
      </footer>
    </div>
  )
}