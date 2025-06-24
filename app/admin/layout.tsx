"use client"

import type React from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't wrap login pages with AuthProvider to avoid SSR issues
  const isLoginPage =
    pathname?.includes("/login") || pathname?.includes("/forgot-password") || pathname?.includes("/reset-password")

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  // For other admin pages, we'll handle auth differently
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
