"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsOverview() {
  const reports = [
    {
      title: "Сводный отчет по инцидентам",
      description: "Общая статистика по всем инцидентам за выбранный период",
      period: "За месяц",
    },
    {
      title: "Отчет о работе инженеров",
      description: "Производительность и загрузка сотрудников технической поддержки",
      period: "За неделю",
    },
    {
      title: "Анализ SLA",
      description: "Соблюдение сроков обработки заявок и превышения SLA",
      period: "За месяц",
    },
    {
      title: "Отчет по категориям",
      description: "Распределение заявок по категориям услуг",
      period: "За квартал",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Период:</span>
          </div>
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="quarter">За квартал</SelectItem>
              <SelectItem value="year">За год</SelectItem>
              <SelectItem value="custom">Произвольный</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="network">Сетевые технологии</SelectItem>
              <SelectItem value="hardware">Оборудование</SelectItem>
              <SelectItem value="software">ПО</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт в Excel
          </Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Динамика заявок</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">График динамики заявок</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по статусам</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Круговая диаграмма</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Время решения</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">График среднего времени</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">SLA метрики</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Показатели SLA</p>
          </div>
        </Card>
      </div>

      {/* Reports list */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Доступные отчеты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{report.period}</span>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-2" />
                  Скачать
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
