import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTickets } from "@/lib/mock-data"
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import type { TicketStatus, TicketPriority } from "@/lib/types"

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

export default function TicketList() {
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
            {mockTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-accent/50 transition-colors">
                <td className="p-4">
                  <Link href={`/tickets/${ticket.id}`} className="font-mono text-sm text-primary hover:underline">
                    {ticket.number}
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
                    <div className="font-medium">{ticket.clientName}</div>
                    <div className="text-muted-foreground">{ticket.clientCompany}</div>
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
                  {ticket.assignedToName || <span className="text-muted-foreground">Не назначен</span>}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: ru })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
