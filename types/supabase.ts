export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: string
          image_url: string | null
          cloudinary_public_id: string | null
          description: string
          badge: string
          is_active: boolean
          created_at: string
          updated_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: string
          image_url?: string | null
          cloudinary_public_id?: string | null
          description: string
          badge: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: string
          image_url?: string | null
          cloudinary_public_id?: string | null
          description?: string
          badge?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          content: string
          rating: number
          is_active: boolean
          created_at: string
          updated_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          role: string
          content: string
          rating: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          role?: string
          content?: string
          rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
      }
      instagram_posts: {
        Row: {
          id: string
          image_url: string
          cloudinary_public_id: string | null
          caption: string
          likes_count: number
          is_active: boolean
          created_at: string
          updated_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          image_url: string
          cloudinary_public_id?: string | null
          caption: string
          likes_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          image_url?: string
          cloudinary_public_id?: string | null
          caption?: string
          likes_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          sort_order?: number
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "owner" | "admin" | "customer"
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: "owner" | "admin" | "customer"
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "owner" | "admin" | "customer"
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          total_amount: number
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          payment_status: "pending" | "paid" | "failed" | "refunded"
          payment_method: string | null
          shipping_address: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          total_amount: number
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_method?: string | null
          shipping_address: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          total_amount?: number
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          payment_method?: string | null
          shipping_address?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      cloudinary_images: {
        Row: {
          id: string
          public_id: string
          secure_url: string
          width: number
          height: number
          format: string
          bytes: number
          folder: string
          tags: string[]
          context: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          public_id: string
          secure_url: string
          width: number
          height: number
          format: string
          bytes: number
          folder: string
          tags?: string[]
          context?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          public_id?: string
          secure_url?: string
          width?: number
          height?: number
          format?: string
          bytes?: number
          folder?: string
          tags?: string[]
          context?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "owner" | "admin" | "customer"
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
    }
  }
}
