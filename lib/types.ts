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
  name: string
  email: string
  phone?: string
  role: UserRole
  company?: string
  supportLevel?: SupportLevel
  skills?: string[]
  priority?: 0 | 1 | 2
  isActive?: boolean
}

export interface Ticket {
  id: string
  number: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  category: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  assignedTo?: string
  assignedToName?: string
  supportLevel: SupportLevel
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  closedAt?: Date
  slaDeadline?: Date
  slaBreached?: boolean
  attachments?: string[]
  comments?: TicketComment[]
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
