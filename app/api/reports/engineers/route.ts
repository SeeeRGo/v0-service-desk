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

    // Get engineers (users with role 'engineer')
    const { data: engineers } = await supabase.from("users").select("id, full_name, email").eq("role", "engineer")

    if (!engineers) {
      return NextResponse.json({ engineers: [] })
    }

    // Get statistics for each engineer
    const engineerStats = await Promise.all(
      engineers.map(async (engineer) => {
        // Total assigned tickets
        const { count: totalAssigned } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("assigned_to", engineer.id)
          .gte("created_at", startDate.toISOString())

        // Resolved tickets
        const { count: resolved } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("assigned_to", engineer.id)
          .eq("status", "resolved")
          .gte("created_at", startDate.toISOString())

        // In progress tickets
        const { count: inProgress } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("assigned_to", engineer.id)
          .in("status", ["assigned", "in_progress"])

        // Average resolution time
        const { data: resolvedTickets } = await supabase
          .from("tickets")
          .select("created_at, resolved_at")
          .eq("assigned_to", engineer.id)
          .not("resolved_at", "is", null)
          .gte("created_at", startDate.toISOString())

        const resolutionTimes =
          resolvedTickets?.map((ticket) => {
            const created = new Date(ticket.created_at).getTime()
            const resolvedAt = new Date(ticket.resolved_at).getTime()
            return (resolvedAt - created) / (1000 * 60 * 60) // hours
          }) || []

        const avgResolutionTime =
          resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : 0

        // Resolution rate
        const resolutionRate = totalAssigned && totalAssigned > 0 ? ((resolved || 0) / totalAssigned) * 100 : 0

        return {
          id: engineer.id,
          name: engineer.full_name,
          email: engineer.email,
          totalAssigned: totalAssigned || 0,
          resolved: resolved || 0,
          inProgress: inProgress || 0,
          avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
          resolutionRate: Math.round(resolutionRate * 10) / 10,
        }
      }),
    )

    // Sort by total assigned tickets
    engineerStats.sort((a, b) => b.totalAssigned - a.totalAssigned)

    return NextResponse.json({ engineers: engineerStats })
  } catch (error) {
    console.error("[v0] Error fetching engineer stats:", error)
    return NextResponse.json({ error: "Failed to fetch engineer statistics" }, { status: 500 })
  }
}
