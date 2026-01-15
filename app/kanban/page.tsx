import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import KanbanBoard from "@/components/kanban/kanban-board"

export default function KanbanPage() {
  return (
    <div className="container mx-auto p-6 h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Канбан доска</h1>
          <p className="text-muted-foreground">Визуализация и управление заявками</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="w-4 h-4 mr-2" />
            Создать заявку
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Загрузка канбан доски...</div>
          </div>
        }
      >
        <KanbanBoard />
      </Suspense>
    </div>
  )
}
