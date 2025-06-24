import { fallbackSettings } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function getSiteSettings() {
  // If Supabase is not configured, return fallback data
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback settings")
    return fallbackSettings
  }

  try {
    // Dynamic import to avoid errors when Supabase is not configured
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Error fetching site settings:", error)
      // Return fallback data on error
      return fallbackSettings
    }

    // Convert array of settings to object
    const settings: Record<string, string> = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    // Merge with fallback settings to ensure all keys exist
    return { ...fallbackSettings, ...settings }
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    // Return fallback data on connection error
    return fallbackSettings
  }
}

export async function updateSiteSetting(key: string, value: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single()

    if (error) {
      console.error("Error updating site setting:", error)
      throw new Error("Failed to update site setting")
    }

    return data
  } catch (error) {
    console.error("Error updating site setting:", error)
    throw new Error("Failed to update site setting")
  }
}

export async function updateMultipleSettings(settings: Record<string, string>) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }))

    const { data, error } = await supabase.from("site_settings").upsert(settingsArray, { onConflict: "key" }).select()

    if (error) {
      console.error("Error updating multiple settings:", error)
      throw new Error("Failed to update settings")
    }

    return data
  } catch (error) {
    console.error("Error updating multiple settings:", error)
    throw new Error("Failed to update settings")
  }
}
