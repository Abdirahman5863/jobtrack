
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

// Use the service role key ONLY for server-side synchronization to bypass RLS when creating/updating users
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// We will create a per-request anon client with user header in getSupabaseClientWithAuth

export async function syncClerkUserToSupabase() {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    // Check if user exists in Supabase
    const { data: existingUser } = await supabaseAdmin.from("users").select("*").eq("id", user.id).single()

    const userData = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      first_name: user.firstName || "",
      last_name: user.lastName || "",
      image_url: user.imageUrl || "",
    }

    if (existingUser) {
      // Update existing user
      const { error } = await supabaseAdmin.from("users").update(userData).eq("id", user.id)

      if (error) {
        console.error("Error updating user:", error)
        return null
      }
    } else {
      // Create new user
      const { error } = await supabaseAdmin.from("users").insert(userData)

      if (error) {
        console.error("Error creating user:", error)
        return null
      }
    }

    return userData
  } catch (error) {
    console.error("Error syncing user:", error)
    return null
  }
}

export async function getSupabaseClientWithAuth() {
  const user = await currentUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Sync user to Supabase
  await syncClerkUserToSupabase()

  // Create a per-request anon client and pass Clerk user id via header for RLS policies
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        "x-client-user-id": user.id,
      },
    },
  })

  // Also set the session GUC for environments where request.headers is not exposed to PostgREST
  try {
    await client.rpc("set_app_user_id", { user_id: user.id })
  } catch (e) {
    // Best-effort; header-based policies should still work
    console.warn("set_app_user_id RPC failed (continuing):", e)
  }

  return client
}
