"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SERVICE_CATEGORIES } from "@/lib/constants"
import { useRouter } from "next/navigation"

export default function CreateTicketForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/tickets")
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type">Тип заявки *</Label>
            <Select defaultValue="incident" required>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incident">Инцидент</SelectItem>
                <SelectItem value="service_request">Запрос на обслуживание</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет *</Label>
            <Select defaultValue="medium" required>
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
          <Label htmlFor="category">Категория *</Label>
          <Select required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Заголовок *</Label>
          <Input id="title" placeholder="Краткое описание проблемы" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание *</Label>
          <Textarea id="description" placeholder="Подробное описание проблемы или запроса" rows={6} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">ФИО клиента *</Label>
            <Input id="clientName" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email *</Label>
            <Input id="clientEmail" type="email" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Телефон</Label>
            <Input id="clientPhone" type="tel" placeholder="+7 (900) 123-45-67" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientCompany">Компания *</Label>
            <Input id="clientCompany" required />
          </div>
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
