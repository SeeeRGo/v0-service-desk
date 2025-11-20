import { Suspense } from "react"
import TicketList from "@/components/tickets/ticket-list"
import TicketFilters from "@/components/tickets/ticket-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Заявки</h1>
          <p className="text-muted-foreground mt-1">Управление инцидентами и запросами на обслуживание</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="w-4 h-4 mr-2" />
            Создать заявку
          </Link>
        </Button>
      </div>

      <TicketFilters />

      <Suspense fallback={<div>Загрузка заявок...</div>}>
        <TicketList />
      </Suspense>
    </div>
  )
}
