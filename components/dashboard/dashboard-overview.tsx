import { Card } from "@/components/ui/card"
// import { mockDashboardStats } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"
import { DashboardStats } from "@/lib/types"
export const mockDashboardStats: DashboardStats = {
  totalTickets: 125,
  activeTickets: 23,
  assignedTickets: 15,
  inProgressTickets: 18,
  resolvedToday: 12,
  averageResolutionTime: 4.5,
  slaBreached: 3,
  engineerWorkload: [
    {
      engineerId: "1",
      engineerName: "Иван Петров",
      activeTickets: 5,
      avgResolutionTime: 3.8,
    },
    {
      engineerId: "2",
      engineerName: "Мария Сидорова",
      activeTickets: 7,
      avgResolutionTime: 5.2,
    },
  ],
}

export default function DashboardOverview() {
  const { engineerWorkload } = mockDashboardStats

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Загрузка инженеров</h2>
        <div className="space-y-4">
          {engineerWorkload.map((engineer) => (
            <div key={engineer.engineerId}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{engineer.engineerName}</span>
                <span className="text-sm text-muted-foreground">{engineer.activeTickets} заявок</span>
              </div>
              <Progress value={(engineer.activeTickets / 10) * 100} />
              <p className="text-xs text-muted-foreground mt-1">Ср. время решения: {engineer.avgResolutionTime}ч</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Статистика по категориям</h2>
        <div className="space-y-3">
          {[
            { category: "Сетевые технологии", count: 15, percentage: 30 },
            { category: "ПО", count: 12, percentage: 24 },
            { category: "Оборудование", count: 10, percentage: 20 },
            { category: "Email", count: 8, percentage: 16 },
            { category: "Другое", count: 5, percentage: 10 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.category}</span>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
              <Progress value={item.percentage} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
