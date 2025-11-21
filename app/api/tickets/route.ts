import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const status = searchParams.get("status")
  const priority = searchParams.get("priority")
  const assignedTo = searchParams.get("assignedTo")

  let query = supabase
    .from("tickets")
    .select(`
      *,
      client:users!tickets_client_id_fkey(id, full_name, email),
      assigned:users!tickets_assigned_to_fkey(id, full_name, email),
      category:service_categories(id, name)
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }
  if (priority) {
    query = query.eq("priority", priority)
  }
  if (assignedTo) {
    query = query.eq("assigned_to", assignedTo)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const ticketData = {
    type: body.ticket_type || body.type,
    title: body.title,
    description: body.description,
    status: body.status || "active",
    priority: body.priority || "medium",
    urgency: body.urgency || "medium",
    impact: body.impact || "medium",
    category_id: body.category_id || null,
    client_id: user.id,
    channel: "portal",
    support_level: "L1",
  }

  const { data, error } = await supabase.from("tickets").insert(ticketData).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
