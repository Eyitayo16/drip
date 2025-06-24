import { fallbackProducts } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function getProducts(activeOnly = false) {
  // If Supabase is not configured, return fallback data
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback data")
    return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
  }

  try {
    // Dynamic import to avoid errors when Supabase is not configured
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    let query = supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      // Return fallback data on error
      return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
    }

    return data || []
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    // Return fallback data on connection error
    return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
  }
}

export async function createProduct(product: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("products").insert(product).select().single()

    if (error) {
      console.error("Error creating product:", error)
      throw new Error("Failed to create product")
    }

    return data
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }
}

export async function updateProduct(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      throw new Error("Failed to update product")
    }

    return data
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      throw new Error("Failed to delete product")
    }

    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

export async function toggleProductStatus(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("is_active")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error("Failed to fetch product status")
    }

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error toggling product status:", error)
      throw new Error("Failed to toggle product status")
    }

    return data
  } catch (error) {
    console.error("Error toggling product status:", error)
    throw new Error("Failed to toggle product status")
  }
}
