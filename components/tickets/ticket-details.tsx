"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Ticket, TicketStatus, TicketPriority } from "@/lib/types"
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_TYPE_LABELS } from "@/lib/constants"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Clock, User, Building2, Mail, Phone, Calendar, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface TicketDetailsProps {
  ticket: Ticket
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
            </div>
            <p className="text-sm font-mono text-muted-foreground">{ticket.number}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[ticket.priority]}>
              {TICKET_PRIORITY_LABELS[ticket.priority]}
            </Badge>
            <Badge variant="outline" className={statusColors[ticket.status]}>
              {TICKET_STATUS_LABELS[ticket.status]}
            </Badge>
            {ticket.slaBreached && <Badge variant="destructive">SLA нарушен</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Создана</p>
              <p className="font-medium">{format(ticket.createdAt, "dd MMM yyyy HH:mm", { locale: ru })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Исполнитель</p>
              <p className="font-medium">{ticket.assignedToName || "Не назначен"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Уровень поддержки</p>
              <p className="font-medium">{ticket.supportLevel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Тип</p>
              <p className="font-medium">{TICKET_TYPE_LABELS[ticket.type]}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Описание</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Комментарии</h2>
            <div className="space-y-4">
              {ticket.comments?.map((comment) => (
                <div key={comment.id} className="p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(comment.createdAt, "dd MMM yyyy HH:mm", { locale: ru })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Textarea placeholder="Добавить комментарий..." rows={3} />
              <Button>Отправить комментарий</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Информация о клиенте</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">ФИО</p>
                  <p className="font-medium">{ticket.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{ticket.clientEmail}</p>
                </div>
              </div>
              {ticket.clientPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Телефон</p>
                    <p className="font-medium">{ticket.clientPhone}</p>
                  </div>
                </div>
              )}
              {ticket.clientCompany && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Компания</p>
                    <p className="font-medium">{ticket.clientCompany}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Действия</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Изменить статус</label>
                <Select defaultValue={ticket.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="assigned">Назначен</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="escalated">Эскалировано</SelectItem>
                    <SelectItem value="resolved">Разрешен</SelectItem>
                    <SelectItem value="waiting">Ожидание</SelectItem>
                    <SelectItem value="closed">Закрыто</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Назначить исполнителя</label>
                <Select defaultValue={ticket.assignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите исполнителя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Иван Петров (L1)</SelectItem>
                    <SelectItem value="2">Мария Сидорова (L2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Эскалировать на L2</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Закрыть заявку
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
