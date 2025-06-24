// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Create a safe Supabase client
let supabase: any = null

if (isSupabaseConfigured()) {
  try {
    // Only import and create client if environment variables are available
    import("@supabase/supabase-js")
      .then(({ createClient }) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        supabase = createClient(supabaseUrl, supabaseAnonKey)
      })
      .catch((error) => {
        console.log("Supabase package not available, using fallback data")
      })
  } catch (error) {
    console.log("Supabase not configured, using fallback data")
  }
}

// Export a function that returns the client or null
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null
  }
  return supabase
}

// Server-side client for admin operations
export const createServerClient = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    throw new Error("Failed to create Supabase server client")
  }
}

export { supabase }
