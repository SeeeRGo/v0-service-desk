import { Card } from "@/components/ui/card"
import { mockDashboardStats } from "@/lib/mock-data"
import { Ticket, Clock, CheckCircle2, AlertTriangle, TrendingUp, Users } from "lucide-react"

export default function DashboardStats() {
  const stats = mockDashboardStats

  const statCards = [
    {
      label: "Всего заявок",
      value: stats.totalTickets,
      icon: Ticket,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Активные заявки",
      value: stats.activeTickets,
      icon: Clock,
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Решено сегодня",
      value: stats.resolvedToday,
      icon: CheckCircle2,
      trend: "+18%",
      trendUp: true,
    },
    {
      label: "Просрочено SLA",
      value: stats.slaBreached,
      icon: AlertTriangle,
      trend: "-2%",
      trendUp: false,
      alert: true,
    },
    {
      label: "Ср. время решения",
      value: `${stats.averageResolutionTime}ч`,
      icon: TrendingUp,
      trend: "-15%",
      trendUp: false,
    },
    {
      label: "В работе",
      value: stats.inProgressTickets,
      icon: Users,
      trend: "+8%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.alert ? "bg-destructive/10" : "bg-primary/10"}`}>
              <stat.icon className={`w-5 h-5 ${stat.alert ? "text-destructive" : "text-primary"}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className={`text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-destructive"}`}>
              {stat.trend}
            </span>
            <span className="text-xs text-muted-foreground">за неделю</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
