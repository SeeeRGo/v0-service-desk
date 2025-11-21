import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  try {
    console.log("[v0] Home page: Creating Supabase client...")
    const supabase = await createClient()

    console.log("[v0] Home page: Getting user...")
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    console.log("[v0] Home page: User:", user ? "authenticated" : "not authenticated")
    console.log("[v0] Home page: Error:", error)

    if (user) {
      console.log("[v0] Home page: Redirecting to dashboard")
      redirect("/dashboard")
    } else {
      console.log("[v0] Home page: Redirecting to login")
      redirect("/auth/login")
    }
  } catch (error) {
    console.error("[v0] Home page error:", error)
    redirect("/auth/login")
  }
}
