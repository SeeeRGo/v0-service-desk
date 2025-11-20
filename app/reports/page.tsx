import ReportsOverview from "@/components/reports/reports-overview"
import { Suspense } from "react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Отчеты и аналитика</h1>
        <p className="text-muted-foreground mt-1">Статистика и показатели эффективности Service Desk</p>
      </div>

      <Suspense fallback={<div>Загрузка отчетов...</div>}>
        <ReportsOverview />
      </Suspense>
    </div>
  )
}
