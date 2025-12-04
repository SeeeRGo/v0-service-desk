"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
}

export default function CreateKBArticleForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/kb-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Статья создана",
        })
        router.push("/knowledge-base")
        router.refresh()
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось создать статью",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать статью",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Заголовок *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Введите заголовок статьи"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Категории не найдены
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Содержание *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Введите содержание статьи..."
            rows={15}
            required
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Создание..." : "Создать статью"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Отмена
          </Button>
        </div>
      </form>
    </Card>
  )
}
