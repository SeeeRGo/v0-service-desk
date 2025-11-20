import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  // Get tickets count by status
  const { data: tickets } = await supabase.from("tickets").select("status, priority")

  if (!tickets) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }

  const stats = {
    totalTickets: tickets.length,
    activeTickets: tickets.filter((t) => t.status === "active").length,
    inProgressTickets: tickets.filter((t) => t.status === "in_progress").length,
    resolvedTickets: tickets.filter((t) => t.status === "resolved").length,
    criticalTickets: tickets.filter((t) => t.priority === "critical").length,
    highTickets: tickets.filter((t) => t.priority === "high").length,
  }

  return NextResponse.json(stats)
}
