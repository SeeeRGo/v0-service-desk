"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export default function TicketFilters() {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активен</SelectItem>
            <SelectItem value="assigned">Назначен</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="escalated">Эскалировано</SelectItem>
            <SelectItem value="resolved">Разрешен</SelectItem>
            <SelectItem value="closed">Закрыто</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все приоритеты</SelectItem>
            <SelectItem value="critical">Критический</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="low">Низкий</SelectItem>
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
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Исполнитель" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все исполнители</SelectItem>
            <SelectItem value="1">Иван Петров</SelectItem>
            <SelectItem value="2">Мария Сидорова</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm">
          <X className="w-4 h-4 mr-2" />
          Сбросить фильтры
        </Button>
      </div>
    </Card>
  )
}
