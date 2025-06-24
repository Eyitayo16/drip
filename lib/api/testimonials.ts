import { fallbackTestimonials } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function getTestimonials(activeOnly = false) {
  // If Supabase is not configured, return fallback data immediately
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback testimonials")
    return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
      console.log("Supabase error, using fallback testimonials:", error.message)
      return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
    }

    return data || fallbackTestimonials
  } catch (error) {
    console.log("Connection error, using fallback testimonials:", error)
    return activeOnly ? fallbackTestimonials.filter((t) => t.is_active) : fallbackTestimonials
  }
}

export async function createTestimonial(testimonial: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single()

    if (error) {
      throw new Error(`Failed to create testimonial: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to create testimonial: ${error}`)
  }
}

export async function updateTestimonial(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update testimonial: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update testimonial: ${error}`)
  }
}

export async function deleteTestimonial(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete testimonial: ${error.message}`)
    }

    return true
  } catch (error) {
    throw new Error(`Failed to delete testimonial: ${error}`)
  }
}

export async function toggleTestimonialStatus(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: testimonial, error: fetchError } = await supabase
      .from("testimonials")
      .select("is_active")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch testimonial: ${fetchError.message}`)
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update({ is_active: !testimonial.is_active })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to toggle testimonial status: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to toggle testimonial status: ${error}`)
  }
}
