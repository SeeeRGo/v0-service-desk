"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import type { TicketStatus, TicketPriority } from "@/lib/types"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const statusColors: Record<TicketStatus, string> = {
  active: "bg-blue-500/10 text-blue-500",
  assigned: "bg-purple-500/10 text-purple-500",
  in_progress: "bg-amber-500/10 text-amber-500",
  escalated: "bg-orange-500/10 text-orange-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-slate-500/10 text-slate-500",
  waiting: "bg-cyan-500/10 text-cyan-500",
}

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-slate-500/10 text-slate-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-red-500/10 text-red-500",
}

interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  client?: {
    full_name: string
    company_id?: string
  }
  assigned?: {
    full_name: string
  }
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
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
        setTickets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки заявок")
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Загрузка заявок...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-500">
          <p className="font-semibold">Ошибка загрузки</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p className="font-semibold">Заявок пока нет</p>
          <p className="text-sm mt-1">Создайте первую заявку, нажав кнопку "Создать заявку"</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent/50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold">Номер</th>
              <th className="text-left p-4 text-sm font-semibold">Заголовок</th>
              <th className="text-left p-4 text-sm font-semibold">Клиент</th>
              <th className="text-left p-4 text-sm font-semibold">Приоритет</th>
              <th className="text-left p-4 text-sm font-semibold">Статус</th>
              <th className="text-left p-4 text-sm font-semibold">Исполнитель</th>
              <th className="text-left p-4 text-sm font-semibold">Создана</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-accent/50 transition-colors">
                <td className="p-4">
                  <Link href={`/tickets/${ticket.id}`} className="font-mono text-sm text-primary hover:underline">
                    {ticket.ticket_number}
                  </Link>
                </td>
                <td className="p-4">
                  <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{ticket.description}</div>
                  </Link>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">{ticket.client?.full_name || "Неизвестно"}</div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={priorityColors[ticket.priority]}>
                    {TICKET_PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={statusColors[ticket.status]}>
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  {ticket.assigned?.full_name || <span className="text-muted-foreground">Не назначен</span>}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ru })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
