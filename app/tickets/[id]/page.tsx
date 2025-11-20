import { notFound } from "next/navigation"
import { mockTickets } from "@/lib/mock-data"
import TicketDetails from "@/components/tickets/ticket-details"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = mockTickets.find((t) => t.id === params.id)

  if (!ticket) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/tickets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к заявкам
          </Link>
        </Button>
      </div>

      <TicketDetails ticket={ticket} />
    </div>
  )
}
