"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Search, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface KBArticle {
  id: string
  title: string
  content: string
  category_id: string
  author_id: string
  views: number
  helpful_count: number
  created_at: string
  author?: {
    id: string
    full_name: string
  }
  category?: {
    id: string
    name: string
  }
}

export default function KnowledgeBaseList() {
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadArticles()
  }, [searchQuery])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const url = searchQuery ? `/api/kb-articles?search=${encodeURIComponent(searchQuery)}` : "/api/kb-articles"

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setArticles(data.articles)
        setError(null)
      } else {
        setError(data.error || "Ошибка загрузки статей")
      }
    } catch (err: any) {
      setError("Не удалось загрузить статьи")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(search)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadArticles} variant="outline">
          Попробовать снова
        </Button>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">База знаний пуста</h3>
        <p className="text-muted-foreground mb-4">{searchQuery ? "Статьи не найдены" : "Добавьте первую статью"}</p>
        <Link href="/knowledge-base/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать статью
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск в базе знаний..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Link href="/knowledge-base/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Новая статья
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/knowledge-base/${article.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {article.category && (
                      <Badge variant="outline" className="text-xs">
                        {article.category.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views || 0}
                    </span>
                    {article.author && <span>• {article.author.full_name}</span>}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
