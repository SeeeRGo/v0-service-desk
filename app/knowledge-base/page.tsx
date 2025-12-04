import KnowledgeBaseList from "@/components/knowledge-base/knowledge-base-list"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">База знаний</h1>
        <p className="text-muted-foreground mt-1">Справочные материалы и решения типовых проблем</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Поиск в базе знаний..." className="pl-10" />
      </div>

      <KnowledgeBaseList />
    </div>
  )
}
