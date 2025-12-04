import KnowledgeBaseList from "@/components/knowledge-base/knowledge-base-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">База знаний</h1>
          <p className="text-muted-foreground mt-1">Справочные материалы и решения типовых проблем</p>
        </div>
        <Link href="/knowledge-base/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Новая статья
          </Button>
        </Link>
      </div>

      <KnowledgeBaseList />
    </div>
  )
}
