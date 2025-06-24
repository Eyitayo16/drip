import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"]

export async function getSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*")

  if (error) {
    console.error("Error fetching site settings:", error)
    throw new Error("Failed to fetch site settings")
  }

  // Convert array to object for easier access
  const settings: Record<string, string> = {}
  data?.forEach((setting) => {
    settings[setting.key] = setting.value
  })

  return settings
}

export async function getSiteSetting(key: string) {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

  if (error) {
    console.error("Error fetching site setting:", error)
    return null
  }

  return data?.value || null
}

export async function setSiteSetting(key: string, value: string) {
  const { data, error } = await supabase.from("site_settings").upsert({ key, value }).select().single()

  if (error) {
    console.error("Error setting site setting:", error)
    throw new Error("Failed to update site setting")
  }

  return data
}

export async function setSiteSettings(settings: Record<string, string>) {
  const settingsArray = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  }))

  const { data, error } = await supabase.from("site_settings").upsert(settingsArray).select()

  if (error) {
    console.error("Error setting site settings:", error)
    throw new Error("Failed to update site settings")
  }

  return data
}

// Default settings to initialize the database
export const defaultSiteSettings = {
  brand_name: "MINIS LUXURY",
  tagline: "Where Nigerian Street Fashion Meets Global Luxury",
  whatsapp_number: "2349057244762",
  instagram_handle: "@Minis_Luxury",
  hero_title: "MINIS LUXURY",
  hero_subtitle: "Where Nigerian Street Fashion Meets Global Luxury",
  about_text:
    "From the vibrant streets of Nigeria to the global luxury fashion scene, Muhammed Umar Faruq has built MINIS LUXURY into the premier destination for discerning fashion enthusiasts.",
  founder_name: "Muhammed Umar Faruq",
  founder_title: "Founder & Creative Director",
  founder_image_url: "/placeholder.svg?height=600&width=500",
}

export async function initializeDefaultSettings() {
  try {
    await setSiteSettings(defaultSiteSettings)
    console.log("Default site settings initialized")
  } catch (error) {
    console.error("Failed to initialize default settings:", error)
  }
}
