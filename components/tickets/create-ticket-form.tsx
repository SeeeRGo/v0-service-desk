"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, addDays, addHours } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description: string | null
  parent_id: string | null
}

export default function CreateTicketForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [deadline, setDeadline] = useState<Date>()

  const [formData, setFormData] = useState({
    type: "incident",
    priority: "medium",
    category_id: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const setDeadlinePreset = (preset: string) => {
    const now = new Date()
    switch (preset) {
      case "2hours":
        setDeadline(addHours(now, 2))
        break
      case "4hours":
        setDeadline(addHours(now, 4))
        break
      case "1day":
        setDeadline(addDays(now, 1))
        break
      case "3days":
        setDeadline(addDays(now, 3))
        break
      case "1week":
        setDeadline(addDays(now, 7))
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ticket_type: formData.type,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category_id: formData.category_id || null,
        status: "active",
        urgency: "medium",
        impact: "medium",
        sla_due_date: deadline ? deadline.toISOString() : null,
      }

      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Ошибка создания заявки")
      }

      toast({
        title: "Заявка создана",
        description: `Заявка #${responseData.ticket_number} успешно создана`,
      })

      router.push("/tickets")
      router.refresh()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать заявку",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type">Тип заявки *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incident">Инцидент</SelectItem>
                <SelectItem value="request">Запрос на обслуживание</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
              required
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="critical">Критический</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            disabled={isLoadingCategories}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={isLoadingCategories ? "Загрузка..." : "Выберите категорию"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Заголовок *</Label>
          <Input
            id="title"
            placeholder="Краткое описание проблемы"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание *</Label>
          <Textarea
            id="description"
            placeholder="Подробное описание проблемы или запроса"
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-3">
          <Label>Дедлайн выполнения</Label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setDeadlinePreset("2hours")}>
              2 часа
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDeadlinePreset("4hours")}>
              4 часа
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDeadlinePreset("1day")}>
              1 день
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDeadlinePreset("3days")}>
              3 дня
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDeadlinePreset("1week")}>
              1 неделя
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "PPP HH:mm", { locale: ru }) : "Выберите дату и время"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
                locale={ru}
                disabled={(date) => date < new Date()}
              />
              {deadline && (
                <div className="p-3 border-t">
                  <Label className="text-xs">Время</Label>
                  <Input
                    type="time"
                    value={deadline ? format(deadline, "HH:mm") : ""}
                    onChange={(e) => {
                      if (deadline && e.target.value) {
                        const [hours, minutes] = e.target.value.split(":")
                        const newDate = new Date(deadline)
                        newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                        setDeadline(newDate)
                      }
                    }}
                    className="mt-1"
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {deadline && (
            <p className="text-sm text-muted-foreground">Дедлайн: {format(deadline, "PPP HH:mm", { locale: ru })}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments">Вложения</Label>
          <Input id="attachments" type="file" multiple />
          <p className="text-sm text-muted-foreground">Вы можете прикрепить скриншоты или другие файлы</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "Создать заявку"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  )
}
