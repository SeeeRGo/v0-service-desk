import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DashboardStats } from "@/lib/types"


export default function DashboardOverview() {
  const engineerWorkload = [] // TODO Make an actual api call for this

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
          {/* TODO make an actual api call for this */ [
          
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
