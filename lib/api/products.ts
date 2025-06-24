import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Product = Database["public"]["Tables"]["products"]["Row"]
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export async function getProducts(activeOnly = false) {
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
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function getProduct(id: string) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product")
  }

  return data
}

export async function createProduct(product: ProductInsert) {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }

  return data
}

export async function updateProduct(id: string, updates: ProductUpdate) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }

  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }

  return true
}

export async function toggleProductStatus(id: string) {
  // First get the current status
  const { data: product, error: fetchError } = await supabase.from("products").select("is_active").eq("id", id).single()

  if (fetchError) {
    throw new Error("Failed to fetch product status")
  }

  // Toggle the status
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
}

export async function updateProductSortOrder(id: string, sortOrder: number) {
  const { data, error } = await supabase
    .from("products")
    .update({ sort_order: sortOrder })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating product sort order:", error)
    throw new Error("Failed to update product sort order")
  }

  return data
}
