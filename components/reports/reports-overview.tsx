"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, TrendingUp, Users, Clock, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

interface IncidentStats {
  statusCounts: { [key: string]: number }
  priorityCounts: { [key: string]: number }
  typeCounts: { [key: string]: number }
  avgResolutionTime: number
  dailyCounts: { [key: string]: number }
  totalTickets: number
  resolvedTickets: number
}

interface EngineerStat {
  id: string
  name: string
  email: string
  totalAssigned: number
  resolved: number
  inProgress: number
  avgResolutionTime: number
  resolutionRate: number
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

const STATUS_LABELS: { [key: string]: string } = {
  active: "Активен",
  assigned: "Назначен",
  in_progress: "В работе",
  escalated: "Эскалировано",
  resolved: "Разрешен",
  closed: "Закрыто",
  pending: "Ожидание",
}

const PRIORITY_LABELS: { [key: string]: string } = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
}

export default function ReportsOverview() {
  const [period, setPeriod] = useState("month")
  const [incidentStats, setIncidentStats] = useState<IncidentStats | null>(null)
  const [engineerStats, setEngineerStats] = useState<EngineerStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [incidentsRes, engineersRes] = await Promise.all([
          fetch(`/api/reports/incidents?period=${period}`),
          fetch(`/api/reports/engineers?period=${period}`),
        ])

        if (incidentsRes.ok) {
          const data = await incidentsRes.json()
          setIncidentStats(data)
        }

        if (engineersRes.ok) {
          const data = await engineersRes.json()
          setEngineerStats(data.engineers || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const statusChartData = incidentStats
    ? Object.entries(incidentStats.statusCounts).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value: value as number,
      }))
    : []

  const priorityChartData = incidentStats
    ? Object.entries(incidentStats.priorityCounts).map(([key, value]) => ({
        name: PRIORITY_LABELS[key] || key,
        value: value as number,
      }))
    : []

  const dailyChartData = incidentStats
    ? Object.entries(incidentStats.dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
          tickets: count,
        }))
    : []

  if (loading) {
    return <div className="text-center py-8">Загрузка статистики...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего заявок</p>
              <h3 className="text-2xl font-bold mt-1">{incidentStats?.totalTickets || 0}</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-violet-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Решено</p>
              <h3 className="text-2xl font-bold mt-1">{incidentStats?.resolvedTickets || 0}</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Среднее время решения</p>
              <h3 className="text-2xl font-bold mt-1">{incidentStats?.avgResolutionTime || 0}ч</h3>
            </div>
            <Clock className="w-8 h-8 text-cyan-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Активных инженеров</p>
              <h3 className="text-2xl font-bold mt-1">{engineerStats.length}</h3>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Период:</span>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="quarter">За квартал</SelectItem>
              <SelectItem value="year">За год</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт в Excel
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Динамика заявок</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tickets" stroke="#8b5cf6" name="Заявки" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по статусам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по приоритетам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" name="Количество" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Среднее время решения</h3>
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <div className="text-5xl font-bold text-violet-500">{incidentStats?.avgResolutionTime || 0}</div>
              <div className="text-sm text-muted-foreground mt-2">часов</div>
              <p className="text-xs text-muted-foreground mt-4">Среднее время решения заявок</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Статистика по исполнителям</h2>
        {engineerStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Инженер</th>
                  <th className="text-center py-3 px-4">Всего назначено</th>
                  <th className="text-center py-3 px-4">Решено</th>
                  <th className="text-center py-3 px-4">В работе</th>
                  <th className="text-center py-3 px-4">% Решения</th>
                  <th className="text-center py-3 px-4">Ср. время (ч)</th>
                </tr>
              </thead>
              <tbody>
                {engineerStats.map((engineer) => (
                  <tr key={engineer.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{engineer.name}</div>
                        <div className="text-xs text-muted-foreground">{engineer.email}</div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{engineer.totalAssigned}</td>
                    <td className="text-center py-3 px-4 text-green-600 font-medium">{engineer.resolved}</td>
                    <td className="text-center py-3 px-4 text-cyan-600 font-medium">{engineer.inProgress}</td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          engineer.resolutionRate >= 80
                            ? "bg-green-100 text-green-700"
                            : engineer.resolutionRate >= 60
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {engineer.resolutionRate}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">{engineer.avgResolutionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Нет данных по исполнителям</p>
        )}
      </Card>
    </div>
  )
}
