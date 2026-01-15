import Link from "next/link"
import type { Ticket } from "@/lib/types"
import { TICKET_PRIORITY_LABELS, TICKET_TYPE_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

interface KanbanCardProps {
  ticket: Ticket
}

export default function KanbanCard({ ticket }: KanbanCardProps) {
  const priorityColors = {
    low: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    high: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    critical: "bg-red-500/10 text-red-700 dark:text-red-400",
  }

  const typeColors = {
    incident: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    service_request: "bg-green-500/10 text-green-700 dark:text-green-400",
  }

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</span>
          <Badge className={priorityColors[ticket.priority]} variant="secondary">
            {TICKET_PRIORITY_LABELS[ticket.priority]}
          </Badge>
        </div>

        {/* Title */}
        <h4 className="font-medium mb-2 line-clamp-2">{ticket.title}</h4>

        {/* Type */}
        <Badge className={`${typeColors[ticket.type]} mb-3`} variant="secondary">
          {TICKET_TYPE_LABELS[ticket.type]}
        </Badge>

        {/* Meta info */}
        <div className="space-y-2 text-xs text-muted-foreground">
          {ticket.assigned?.full_name && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span className="truncate">{ticket.assigned.full_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(ticket.created_at), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          </div>

          {ticket.sla_due_date && (
            <div className="flex items-center gap-2">
              <span className="text-xs">SLA:</span>
              <span className={new Date(ticket.sla_due_date) < new Date() ? "text-red-500" : ""}>
                {formatDistanceToNow(new Date(ticket.sla_due_date), {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
