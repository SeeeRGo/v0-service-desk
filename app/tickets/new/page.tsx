import CreateTicketForm from "@/components/tickets/create-ticket-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewTicketPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/tickets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к заявкам
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Создание заявки</h1>
        <p className="text-muted-foreground mt-1">Заполните форму для создания новой заявки</p>
      </div>

      <CreateTicketForm />
    </div>
  )
}
