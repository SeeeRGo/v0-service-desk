import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let query = supabase
      .from("kb_articles")
      .select(`
        *,
        author:users!author_id(id, full_name, email),
        category:service_categories!category_id(id, name)
      `)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: articles, error } = await query

    if (error) {
      console.error("[v0] KB articles query error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ articles: articles || [] })
  } catch (error: any) {
    console.error("[v0] KB articles API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category_id } = body

    const { data: article, error } = await supabase
      .from("kb_articles")
      .insert({
        title,
        content,
        category_id,
        author_id: user.id,
        views: 0,
        helpful_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] KB article create error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article })
  } catch (error: any) {
    console.error("[v0] KB article create API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
