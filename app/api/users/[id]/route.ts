import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user's role
    const { data: currentUserData } = await supabase.from("users").select("role").eq("id", user.id).single()

    // Only admins can update users
    if (currentUserData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase.from("users").update({ role: body.role }).eq("id", id)

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in user update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
