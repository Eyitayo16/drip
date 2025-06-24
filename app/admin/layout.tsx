import type React from "react"
import { SupabaseAuthProvider } from "@/hooks/use-supabase-auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseAuthProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </SupabaseAuthProvider>
  )
}
