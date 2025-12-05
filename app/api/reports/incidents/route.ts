import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get tickets by status
    const { data: ticketsByStatus } = await supabase
      .from("tickets")
      .select("status")
      .gte("created_at", startDate.toISOString())

    const statusCounts =
      ticketsByStatus?.reduce((acc: any, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1
        return acc
      }, {}) || {}

    // Get tickets by priority
    const { data: ticketsByPriority } = await supabase
      .from("tickets")
      .select("priority")
      .gte("created_at", startDate.toISOString())

    const priorityCounts =
      ticketsByPriority?.reduce((acc: any, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
        return acc
      }, {}) || {}

    // Get tickets by type
    const { data: ticketsByType } = await supabase
      .from("tickets")
      .select("type")
      .gte("created_at", startDate.toISOString())

    const typeCounts =
      ticketsByType?.reduce((acc: any, ticket) => {
        acc[ticket.type] = (acc[ticket.type] || 0) + 1
        return acc
      }, {}) || {}

    // Get resolution time statistics
    const { data: resolvedTickets } = await supabase
      .from("tickets")
      .select("created_at, resolved_at")
      .not("resolved_at", "is", null)
      .gte("created_at", startDate.toISOString())

    const resolutionTimes =
      resolvedTickets?.map((ticket) => {
        const created = new Date(ticket.created_at).getTime()
        const resolved = new Date(ticket.resolved_at).getTime()
        return (resolved - created) / (1000 * 60 * 60) // hours
      }) || []

    const avgResolutionTime =
      resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : 0

    // Get daily ticket counts for chart
    const { data: dailyTickets } = await supabase
      .from("tickets")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    const dailyCounts: { [key: string]: number } = {}
    dailyTickets?.forEach((ticket) => {
      const date = new Date(ticket.created_at).toISOString().split("T")[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return NextResponse.json({
      statusCounts,
      priorityCounts,
      typeCounts,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      dailyCounts,
      totalTickets: ticketsByStatus?.length || 0,
      resolvedTickets: resolvedTickets?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching incident stats:", error)
    return NextResponse.json({ error: "Failed to fetch incident statistics" }, { status: 500 })
  }
}
