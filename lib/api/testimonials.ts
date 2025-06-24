import { fallbackTestimonials } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function getTestimonials(activeOnly = false) {
  // If Supabase is not configured, return fallback data
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback testimonials")
    return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
  }

  try {
    // Dynamic import to avoid errors when Supabase is not configured
    const { supabase } = await import("@/lib/supabase")

    let query = supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching testimonials:", error)
      // Return fallback data on error
      return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
    }

    return data || []
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    // Return fallback data on connection error
    return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
  }
}

export async function createTestimonial(testimonial: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { supabase } = await import("@/lib/supabase")
    const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single()

    if (error) {
      console.error("Error creating testimonial:", error)
      throw new Error("Failed to create testimonial")
    }

    return data
  } catch (error) {
    console.error("Error creating testimonial:", error)
    throw new Error("Failed to create testimonial")
  }
}

export async function updateTestimonial(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { supabase } = await import("@/lib/supabase")
    const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating testimonial:", error)
      throw new Error("Failed to update testimonial")
    }

    return data
  } catch (error) {
    console.error("Error updating testimonial:", error)
    throw new Error("Failed to update testimonial")
  }
}

export async function deleteTestimonial(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { supabase } = await import("@/lib/supabase")
    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) {
      console.error("Error deleting testimonial:", error)
      throw new Error("Failed to delete testimonial")
    }

    return true
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    throw new Error("Failed to delete testimonial")
  }
}

export async function toggleTestimonialStatus(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { supabase } = await import("@/lib/supabase")
    const { data: testimonial, error: fetchError } = await supabase
      .from("testimonials")
      .select("is_active")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error("Failed to fetch testimonial status")
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update({ is_active: !testimonial.is_active })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error toggling testimonial status:", error)
      throw new Error("Failed to toggle testimonial status")
    }

    return data
  } catch (error) {
    console.error("Error toggling testimonial status:", error)
    throw new Error("Failed to toggle testimonial status")
  }
}
