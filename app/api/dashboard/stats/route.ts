import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  // Get tickets count by status
  const { data: tickets } = await supabase
    .from("tickets")
    .select("status, priority, assigned_to, created_at, resolved_at")

  if (!tickets) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }

  // Calculate resolved today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const resolvedToday = tickets.filter((t) => {
    if (!t.resolved_at) return false
    const resolvedDate = new Date(t.resolved_at)
    return resolvedDate >= today && t.status === "resolved"
  }).length

  // Calculate average resolution time
  const resolvedTickets = tickets.filter((t) => t.resolved_at && t.created_at)
  const avgResolutionTime =
    resolvedTickets.length > 0
      ? resolvedTickets.reduce((sum, t) => {
          const created = new Date(t.created_at).getTime()
          const resolved = new Date(t.resolved_at).getTime()
          return sum + (resolved - created) / (1000 * 60 * 60) // hours
        }, 0) / resolvedTickets.length
      : 0

  // Calculate SLA breached (tickets without sla_due_date or past due date)
  const now = new Date()
  const { data: slaTickets } = await supabase
    .from("tickets")
    .select("sla_due_date, status")
    .not("sla_due_date", "is", null)

  const slaBreached =
    slaTickets?.filter((t) => {
      if (t.status === "resolved" || t.status === "closed") return false
      return new Date(t.sla_due_date) < now
    }).length || 0

  const { data: assignees } = await supabase
    .from("users")
    .select("id, full_name, role")
    .in("role", ["engineer", "supervisor", "admin"])

  const assigneeWorkload = await Promise.all(
    (assignees || []).map(async (assignee) => {
      const { data: assigneeTickets } = await supabase
        .from("tickets")
        .select("status, created_at, resolved_at")
        .eq("assigned_to", assignee.id)

      const activeTickets = assigneeTickets?.filter((t) => t.status !== "resolved" && t.status !== "closed").length || 0

      const resolvedByAssignee = assigneeTickets?.filter((t) => t.resolved_at && t.created_at) || []
      const avgTime =
        resolvedByAssignee.length > 0
          ? resolvedByAssignee.reduce((sum, t) => {
              const created = new Date(t.created_at).getTime()
              const resolved = new Date(t.resolved_at!).getTime()
              return sum + (resolved - created) / (1000 * 60 * 60)
            }, 0) / resolvedByAssignee.length
          : 0

      return {
        assigneeId: assignee.id,
        assigneeName: assignee.full_name,
        assigneeRole: assignee.role,
        activeTickets,
        avgResolutionTime: Math.round(avgTime * 10) / 10,
      }
    }),
  )

  const stats = {
    totalTickets: tickets.length,
    activeTickets: tickets.filter((t) => t.status === "active").length,
    assignedTickets: tickets.filter((t) => t.status === "assigned").length,
    inProgressTickets: tickets.filter((t) => t.status === "in_progress").length,
    resolvedTickets: tickets.filter((t) => t.status === "resolved").length,
    resolvedToday,
    averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    slaBreached,
    criticalTickets: tickets.filter((t) => t.priority === "critical").length,
    highTickets: tickets.filter((t) => t.priority === "high").length,
    assigneeWorkload,
  }

  return NextResponse.json(stats)
}
