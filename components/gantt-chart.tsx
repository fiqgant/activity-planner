"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/generator"
import { formatDate } from "@/lib/generator"
import { exportToExcel } from "@/lib/excel-export"

interface GanttChartProps {
  activities: Activity[]
}

const CATEGORY_COLORS: Record<string, string> = {
  "Business Development": "#3b82f6",
  Operasional: "#8b5cf6",
  Keuangan: "#22c55e",
  SDM: "#eab308",
  "Marketing & Sales": "#ec4899",
  "Customer Experience": "#06b6d4",
}

export function GanttChart({ activities }: GanttChartProps) {
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }, [activities])

  const timeline = useMemo(() => {
    if (sortedActivities.length === 0) return null
    const minDate = new Date(Math.min(...sortedActivities.map((a) => a.startDate.getTime())))
    const maxDate = new Date(Math.max(...sortedActivities.map((a) => a.endDate.getTime())))
    minDate.setDate(minDate.getDate() - 1)
    maxDate.setDate(maxDate.getDate() + 1)
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    return { minDate, maxDate, totalDays }
  }, [sortedActivities])

  const handleDownload = () => {
    exportToExcel(activities, "activity-plan-gantt")
  }

  if (activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Gantt Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Belum ada data.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          Gantt Chart
          <Badge variant="secondary">{activities.length} activities</Badge>
        </CardTitle>
        <Button onClick={handleDownload} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {timeline && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(timeline.minDate)}</span>
            <div className="flex-1 h-px bg-border" />
            <span>{timeline.totalDays} hari</span>
            <div className="flex-1 h-px bg-border" />
            <span>{formatDate(timeline.maxDate)}</span>
          </div>
        )}

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {sortedActivities.map((activity) => {
            const startOffset = timeline ? Math.floor((activity.startDate.getTime() - timeline.minDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
            const leftPercent = timeline ? (startOffset / timeline.totalDays) * 100 : 0
            const widthPercent = timeline ? (activity.duration / timeline.totalDays) * 100 : 10
            
            return (
              <div key={activity.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <div className="text-sm font-medium truncate">{activity.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[activity.category] || "#6b7280" }} />
                    {activity.category}
                  </div>
                </div>
                <div className="flex-1 relative h-8">
                  <div className="absolute inset-0 bg-muted rounded-md" />
                  <div
                    className="absolute top-1 bottom-1 rounded-md transition-all"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                      backgroundColor: CATEGORY_COLORS[activity.category] || "#6b7280",
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      {activity.duration}d
                    </span>
                  </div>
                </div>
                <div className="w-20 shrink-0 text-xs text-muted-foreground text-right">
                  {formatDate(activity.startDate)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Legend - Kategori</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
              <div key={category} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs">{category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium">Ringkasan:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-1 font-medium">{activities.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Durasi:</span>
              <span className="ml-1 font-medium">{activities.reduce((sum, a) => sum + a.duration, 0)} hari</span>
            </div>
            <div>
              <span className="text-muted-foreground">Prioritas Tinggi:</span>
              <span className="ml-1 font-medium text-red-600">{activities.filter((a) => a.priority === "high").length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Periode:</span>
              <span className="ml-1 font-medium">{timeline?.totalDays || 0} hari</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}