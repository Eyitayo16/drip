"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "owner" | "admin"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Crown className="h-12 w-12 text-yellow-400 mb-4" />
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check role permissions
  if (requiredRole && user?.role !== requiredRole && user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Crown className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center">
              You don't have permission to access this section. Contact the owner for access.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
