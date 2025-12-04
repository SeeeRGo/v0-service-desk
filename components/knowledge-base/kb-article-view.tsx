"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, ThumbsUp, Calendar, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface KBArticle {
  id: string
  title: string
  content: string
  views: number
  helpful_count: number
  created_at: string
  author?: {
    full_name: string
  }
  category?: {
    name: string
  }
}

export default function KBArticleView({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [article, setArticle] = useState<KBArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/kb-articles/${articleId}`)
      const data = await response.json()

      if (response.ok) {
        setArticle(data.article)
      }
    } catch (error) {
      console.error("Error loading article:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Статья не найдена</p>
        <Link href="/knowledge-base">
          <Button variant="outline">Вернуться к базе знаний</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>

      <Card className="p-8">
        <div className="space-y-6">
          <div>
            {article.category && (
              <Badge variant="outline" className="mb-3">
                {article.category.name}
              </Badge>
            )}
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author.full_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString("ru-RU")}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views || 0} просмотров
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {article.helpful_count || 0} полезно
              </span>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
