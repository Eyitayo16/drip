import { fallbackProducts } from "@/lib/fallback-data"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function getProducts(activeOnly = false) {
  // If Supabase is not configured, return fallback data immediately
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback data")
    return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
  }

  try {
    // Only try to connect to Supabase if it's configured
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
      console.log("Supabase error, using fallback data:", error.message)
      return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
    }

    return data || fallbackProducts
  } catch (error) {
    console.log("Connection error, using fallback data:", error)
    return activeOnly ? fallbackProducts.filter((p) => p.is_active) : fallbackProducts
  }
}

export async function createProduct(product: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("products").insert(product).select().single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to create product: ${error}`)
  }
}

export async function updateProduct(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to update product: ${error}`)
  }
}

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    return true
  } catch (error) {
    throw new Error(`Failed to delete product: ${error}`)
  }
}

export async function toggleProductStatus(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Database not configured. Please contact administrator.")
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
      throw new Error(`Failed to fetch product: ${fetchError.message}`)
    }

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to toggle product status: ${error.message}`)
    }

    return data
  } catch (error) {
    throw new Error(`Failed to toggle product status: ${error}`)
  }
}
