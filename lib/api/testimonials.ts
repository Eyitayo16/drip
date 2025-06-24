import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]
type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"]
type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"]

export async function getTestimonials(activeOnly = false) {
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
    throw new Error("Failed to fetch testimonials")
  }

  return data || []
}

export async function createTestimonial(testimonial: TestimonialInsert) {
  const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single()

  if (error) {
    console.error("Error creating testimonial:", error)
    throw new Error("Failed to create testimonial")
  }

  return data
}

export async function updateTestimonial(id: string, updates: TestimonialUpdate) {
  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating testimonial:", error)
    throw new Error("Failed to update testimonial")
  }

  return data
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("Error deleting testimonial:", error)
    throw new Error("Failed to delete testimonial")
  }

  return true
}

export async function toggleTestimonialStatus(id: string) {
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
}
