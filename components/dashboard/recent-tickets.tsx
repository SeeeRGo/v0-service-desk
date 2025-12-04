'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants"
import Link from "next/link"
import { formatDistanceToNow, isAfter } from "date-fns"
import { ru } from "date-fns/locale"
import type { TicketStatus, TicketPriority, Ticket } from "@/lib/types"
import { useEffect, useState } from "react"

const statusColors: Record<TicketStatus, string> = {
  active: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  assigned: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  in_progress: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  escalated: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  resolved: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  closed: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
  waiting: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
}

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-slate-500/10 text-slate-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-red-500/10 text-red-500",
}

export default function RecentTickets() {
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch("/api/tickets")

        if (!response.ok) {
          throw new Error("Failed to load tickets")
        }

        const data = await response.json()
        setRecentTickets(data.slice(0,5))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки заявок")
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])
  const slaBreached = (ticket: Ticket) => ticket.sla_due_date && !ticket.resolved_at && isAfter(new Date(), new Date(ticket.sla_due_date))
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Последние заявки</h2>
      <div className="space-y-3">
        {recentTickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</span>
                  <Badge variant="outline" className={priorityColors[ticket.priority]}>
                    {TICKET_PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                  <Badge variant="outline" className={statusColors[ticket.status]}>
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1 truncate">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{ticket.client?.full_name}</span>
                  {ticket.assigned?.full_name && (
                    <>
                      <span>•</span>
                      <span>Исполнитель: {ticket.assigned.full_name}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatDistanceToNow(ticket.created_at, { addSuffix: true, locale: ru })}</span>
                </div>
              </div>
              {slaBreached(ticket) && <div className="text-destructive text-xs font-medium">SLA нарушен</div>}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
