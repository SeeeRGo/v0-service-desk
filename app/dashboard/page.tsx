import { Suspense } from "react"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import RecentTickets from "@/components/dashboard/recent-tickets"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground mt-1">Обзор работы Service Desk в реальном времени</p>
      </div>

      <Suspense fallback={<div>Загрузка статистики...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Suspense fallback={<div>Загрузка заявок...</div>}>
            <RecentTickets />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Загрузка обзора...</div>}>
            <DashboardOverview />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
