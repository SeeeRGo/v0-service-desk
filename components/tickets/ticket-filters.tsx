"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface TicketFiltersProps {
  onFiltersChange: (filters: {
    status: string
    priority: string
    category: string
    assignedTo: string
  }) => void
  categories: Array<{ id: string; name: string }>
  assignees: Array<{ id: string; full_name: string }>
}

export default function TicketFilters({ onFiltersChange, categories, assignees }: TicketFiltersProps) {
  const [status, setStatus] = useState("all")
  const [priority, setPriority] = useState("all")
  const [category, setCategory] = useState("all")
  const [assignedTo, setAssignedTo] = useState("all")

  useEffect(() => {
    onFiltersChange({ status, priority, category, assignedTo })
  }, [status, priority, category, assignedTo, onFiltersChange])

  const handleReset = () => {
    setStatus("all")
    setPriority("all")
    setCategory("all")
    setAssignedTo("all")
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select value={status} onValueChange={setStatus}>
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
            <SelectItem value="waiting">Ожидание</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
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

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Исполнитель" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все исполнители</SelectItem>
            {assignees.map((assignee) => (
              <SelectItem key={assignee.id} value={assignee.id}>
                {assignee.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="w-4 h-4 mr-2" />
          Сбросить фильтры
        </Button>
      </div>
    </Card>
  )
}
