"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "owner" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem("minisLuxuryAuth")
      const sessionExpiry = localStorage.getItem("minisLuxuryAuthExpiry")

      if (storedUser && sessionExpiry) {
        const expiryTime = Number.parseInt(sessionExpiry)
        const currentTime = Date.now()

        if (currentTime < expiryTime) {
          setUser(JSON.parse(storedUser))
        } else {
          // Session expired
          localStorage.removeItem("minisLuxuryAuth")
          localStorage.removeItem("minisLuxuryAuthExpiry")
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (userData: User) => {
    try {
      // Set session expiry to 24 hours
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000

      localStorage.setItem("minisLuxuryAuth", JSON.stringify(userData))
      localStorage.setItem("minisLuxuryAuthExpiry", expiryTime.toString())

      setUser(userData)
    } catch (error) {
      throw new Error("Login failed")
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("minisLuxuryAuth")
      localStorage.removeItem("minisLuxuryAuthExpiry")
      setUser(null)
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
