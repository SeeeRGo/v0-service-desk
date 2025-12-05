"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import type { DashboardStats } from "@/lib/types"

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categories, setCategories] = useState<Array<{ category: string; count: number; percentage: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load dashboard stats (includes engineerWorkload)
        const statsResponse = await fetch("/api/dashboard/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Load category statistics
        const categoriesResponse = await fetch("/api/reports/incidents?period=month")
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json()
          if (data.categories) {
            const total = data.categories.reduce((sum: number, cat: any) => sum + cat.count, 0)
            const categoryStats = data.categories.map((cat: any) => ({
              category: cat.name,
              count: cat.count,
              percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
            }))
            setCategories(categoryStats)
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard overview:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 animate-pulse">
          <div className="h-48 bg-muted rounded" />
        </Card>
        <Card className="p-6 animate-pulse">
          <div className="h-48 bg-muted rounded" />
        </Card>
      </div>
    )
  }

  const engineerWorkload = stats?.engineerWorkload || []

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Загрузка инженеров</h2>
        <div className="space-y-4">
          {engineerWorkload.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет данных по инженерам</p>
          ) : (
            engineerWorkload.map((engineer) => (
              <div key={engineer.engineerId}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{engineer.engineerName}</span>
                  <span className="text-sm text-muted-foreground">{engineer.activeTickets} заявок</span>
                </div>
                <Progress value={(engineer.activeTickets / 10) * 100} />
                <p className="text-xs text-muted-foreground mt-1">Ср. время решения: {engineer.avgResolutionTime}ч</p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Статистика по категориям</h2>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет данных по категориям</p>
          ) : (
            categories.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.category}</span>
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                </div>
                <Progress value={item.percentage} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
