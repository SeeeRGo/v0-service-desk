import type { TICKET_TYPE_LABELS } from "./constants"

export type UserRole = "client" | "engineer" | "supervisor" | "admin"

export type TicketStatus =
  | "active" // Новый
  | "assigned" // Назначен
  | "in_progress" // В работе
  | "escalated" // Эскалировано
  | "resolved" // Разрешен
  | "closed" // Закрыто
  | "waiting" // Ожидание

export type TicketPriority = "low" | "medium" | "high" | "critical"

export type TicketType = "incident" | "service_request"

export type SupportLevel = "L1" | "L2" | "L3"

export interface User {
  id: string
  full_name?: string
  name: string
  email: string
  phone?: string
  role: UserRole
  company?: string
  company_id?: string
  supportLevel?: SupportLevel
  skills?: string[]
  priority?: 0 | 1 | 2
  isActive?: boolean
  created_at?: string
}

export interface TicketComment {
  id: string
  ticketId: string
  userId: string
  userName: string
  content: string
  createdAt: Date
  isInternal?: boolean
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  subcategories?: string[]
}

export interface DashboardStats {
  totalTickets: number
  activeTickets: number
  assignedTickets: number
  inProgressTickets: number
  resolvedToday: number
  averageResolutionTime: number
  slaBreached: number
  engineerWorkload: {
    engineerId: string
    engineerName: string
    activeTickets: number
    avgResolutionTime: number
  }[]
}
export interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  client?: {
    full_name: string
    email?: string
    phone?: string
    company_id?: string
  }
  assigned?: {
    full_name: string
    email?: string
  }
  sla_due_date: string | null
  resolved_at: string | null
  support_level: string
  type: keyof typeof TICKET_TYPE_LABELS
  comments?: TicketComment[]
}
