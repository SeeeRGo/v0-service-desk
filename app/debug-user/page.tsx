import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DebugUserPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Error</h1>
        <pre className="bg-destructive/10 p-4 rounded">{JSON.stringify(authError, null, 2)}</pre>
      </div>
    )
  }

  if (!user) {
    redirect("/auth/login")
  }

  // Try to fetch user profile
  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug: Current User</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Auth User:</h2>
        <pre className="bg-muted p-4 rounded overflow-auto">{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">User Profile:</h2>
        {profileError ? (
          <pre className="bg-destructive/10 p-4 rounded">{JSON.stringify(profileError, null, 2)}</pre>
        ) : (
          <pre className="bg-muted p-4 rounded overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
        <pre className="bg-muted p-4 rounded">
          SUPABASE_URL: {process.env.SUPABASE_URL ? "✓ Set" : "✗ Not set"}
          {"\n"}
          NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Not set"}
          {"\n"}
          SUPABASE_ANON_KEY: {process.env.SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set"}
          {"\n"}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set"}
        </pre>
      </div>
    </div>
  )
}
