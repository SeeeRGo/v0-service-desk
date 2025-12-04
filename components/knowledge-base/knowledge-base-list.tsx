import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Video, Code } from "lucide-react"

const articles = [
  {
    id: 1,
    title: "Настройка VPN подключения",
    category: "Сетевые технологии",
    type: "guide",
    icon: FileText,
    views: 245,
  },
  {
    id: 2,
    title: "Устранение проблем с печатью",
    category: "Оборудование",
    type: "troubleshooting",
    icon: BookOpen,
    views: 189,
  },
  {
    id: 3,
    title: "Видеоинструкция: Работа с CRM",
    category: "ПО",
    type: "video",
    icon: Video,
    views: 312,
  },
  {
    id: 4,
    title: "API интеграции с биллингом",
    category: "Разработка",
    type: "technical",
    icon: Code,
    views: 87,
  },
]

export default function KnowledgeBaseList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <article.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{article.views} просмотров</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
