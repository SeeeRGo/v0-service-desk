import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const roleFilter = searchParams.get("role")

    // Get current user's role
    const { data: currentUserData } = await supabase.from("users").select("role").eq("id", user.id).single()

    let query = supabase
      .from("users")
      .select("id, full_name, email, role, company_id, created_at")
      .order("created_at", { ascending: false })

    if (roleFilter) {
      query = query.eq("role", roleFilter)
    } else {
      if (currentUserData?.role !== "admin" && currentUserData?.role !== "supervisor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const { data: users, error } = await query

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
