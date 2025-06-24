import { fallbackSettings } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function getSiteSettings() {
  // If Supabase is not configured, return fallback data immediately
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback settings")
    return fallbackSettings
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.log("Supabase error, using fallback settings:", error.message)
      return fallbackSettings
    }

    // Convert array of key-value pairs to object
    const settings: Record<string, string> = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    // Merge with fallback settings to ensure all keys exist
    return { ...fallbackSettings, ...settings }
  } catch (error) {
    console.log("Connection error, using fallback settings:", error)
    return fallbackSettings
  }
}

export async function updateSiteSetting(key: string, value: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
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
      throw new Error(`Failed to update setting: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update setting: ${error}`)
  }
}

export async function updateMultipleSettings(settings: Record<string, string>) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }))

    const { data, error } = await supabase.from("site_settings").upsert(settingsArray, { onConflict: "key" }).select()

    if (error) {
      throw new Error(`Failed to update settings: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update settings: ${error}`)
  }
}

export async function setSiteSettings(settings: Record<string, string>) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }))

    const { data, error } = await supabase.from("site_settings").upsert(settingsArray, { onConflict: "key" }).select()

    if (error) {
      throw new Error(`Failed to update settings: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update settings: ${error}`)
  }
}

export async function setSiteSetting(key: string, value: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
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
      throw new Error(`Failed to update setting: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update setting: ${error}`)
  }
}
