'use client'
import { notFound } from "next/navigation"
import TicketDetails from "@/components/tickets/ticket-details"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Ticket } from "@/lib/types"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [ticket, setTicket] = useState<Ticket>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function loadTickets() {
      try {
        const {id} = await params
        const response = await fetch(`/api/tickets/${id}`)

        if (!response.ok) {
          throw new Error("Failed to load tickets")
        }

        const data = await response.json()
        setTicket(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки заявок")
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])
  if (!ticket && !loading) {
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

      {ticket && <TicketDetails ticket={ticket} />}
    </div>
  )
}
