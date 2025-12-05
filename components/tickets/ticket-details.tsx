"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Ticket, TicketStatus, TicketPriority, User } from "@/lib/types"
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_TYPE_LABELS } from "@/lib/constants"
import { format, isAfter } from "date-fns"
import { ru } from "date-fns/locale"
import { Clock, UserIcon, Building2, Mail, Phone, Calendar, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  const [comments, setComments] = useState<any[]>(ticket.comments || [])
  const [newComment, setNewComment] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status)
  const [selectedAssignee, setSelectedAssignee] = useState<string>(ticket.assigned_to || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const slaBreached = ticket.sla_due_date && !ticket.resolved_at && isAfter(new Date(), new Date(ticket.sla_due_date))

  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const usersData = await response.json()
          setUsers(usersData)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }
    fetchUsers()
  }, [])

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
          is_internal: false,
        }),
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments([...comments, newCommentData])
        setNewComment("")
        toast({
          title: "Комментарий добавлен",
          description: "Ваш комментарий успешно добавлен к заявке",
        })
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить комментарий",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle status change
  const handleStatusChange = async (newStatus: TicketStatus) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSelectedStatus(newStatus)
        toast({
          title: "Статус изменен",
          description: `Статус заявки изменен на "${TICKET_STATUS_LABELS[newStatus]}"`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle assignee change
  const handleAssigneeChange = async (assigneeId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assigned_to: assigneeId }),
      })

      if (response.ok) {
        const user = users.find((u) => u.id === assigneeId)
        setSelectedAssignee(assigneeId)
        toast({
          title: "Исполнитель назначен",
          description: `Заявка назначена на ${user?.full_name || user?.name}`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to assign user")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось назначить исполнителя",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle escalation
  const handleEscalate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "escalated",
          support_level: "L2",
        }),
      })

      if (response.ok) {
        toast({
          title: "Заявка эскалирована",
          description: "Заявка успешно эскалирована на уровень L2",
        })
        router.refresh()
      } else {
        throw new Error("Failed to escalate ticket")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось эскалировать заявку",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle close ticket
  const handleCloseTicket = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "closed",
          resolved_at: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Заявка закрыта",
          description: "Заявка успешно закрыта",
        })
        router.refresh()
      } else {
        throw new Error("Failed to close ticket")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось закрыть заявку",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
            </div>
            <p className="text-sm font-mono text-muted-foreground">{ticket.ticket_number}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[ticket.priority]}>
              {TICKET_PRIORITY_LABELS[ticket.priority]}
            </Badge>
            <Badge variant="outline" className={statusColors[ticket.status]}>
              {TICKET_STATUS_LABELS[ticket.status]}
            </Badge>
            {slaBreached && <Badge variant="destructive">SLA нарушен</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Создана</p>
              <p className="font-medium">{format(ticket.created_at, "dd MMM yyyy HH:mm", { locale: ru })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Исполнитель</p>
              <p className="font-medium">{ticket.assigned?.full_name || "Не назначен"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Уровень поддержки</p>
              <p className="font-medium">{ticket.support_level}</p>
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
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{comment.user.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "dd MMM yyyy HH:mm", { locale: ru })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                  {comment.is_internal && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Внутренний комментарий
                    </Badge>
                  )}
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-muted-foreground">Пока нет комментариев</p>}
            </div>

            <div className="mt-6 space-y-3">
              <Textarea
                placeholder="Добавить комментарий..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleCommentSubmit} disabled={!newComment.trim() || isLoading}>
                {isLoading ? "Отправка..." : "Отправить комментарий"}
              </Button>
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
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">ФИО</p>
                  <p className="font-medium">{ticket.client?.full_name || "Не указано"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{ticket.client?.email || "Не указано"}</p>
                </div>
              </div>
              {ticket.client?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Телефон</p>
                    <p className="font-medium">{ticket.client.phone}</p>
                  </div>
                </div>
              )}
              {ticket.client?.company_id && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Компания</p>
                    <p className="font-medium">{ticket.client?.company_id}</p>
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
                <Select
                  value={selectedStatus}
                  onValueChange={(value: TicketStatus) => handleStatusChange(value)}
                  disabled={isLoading}
                >
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
                <Select value={selectedAssignee} onValueChange={handleAssigneeChange} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите исполнителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.name} - {user.role}
                      </SelectItem>
                    ))}
                    {users.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">Нет доступных исполнителей</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleEscalate}
                disabled={isLoading || selectedStatus === "escalated"}
              >
                {isLoading ? "Загрузка..." : "Эскалировать на L2"}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleCloseTicket}
                disabled={isLoading || selectedStatus === "closed"}
              >
                {isLoading ? "Загрузка..." : "Закрыть заявку"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
