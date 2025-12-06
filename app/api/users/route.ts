import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] Users API - Current user:", user?.id)

    if (!user) {
      console.log("[v0] Users API - No authenticated user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const roleFilter = searchParams.get("role")

    console.log("[v0] Users API - Role filter:", roleFilter)

    let query = supabase
      .from("users")
      .select("id, full_name, email, role, company_id, created_at")
      .order("created_at", { ascending: false })

    if (roleFilter === "engineer") {
      query = query.in("role", ["engineer", "supervisor", "admin"])
    } else if (roleFilter) {
      query = query.eq("role", roleFilter)
    }

    const { data: users, error } = await query

    console.log("[v0] Users API - Query result:", { count: users?.length, error: error?.message })
    console.log("[v0] Users API - Users data:", users)

    if (error) {
      console.error("[v0] Users API - Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error("[v0] Users API - Catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
