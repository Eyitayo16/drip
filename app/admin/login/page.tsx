"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Eye, EyeOff, Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Simple auth hook that doesn't depend on context during SSR
function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check auth status on client side only
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("minisLuxuryAuth")
        const sessionExpiry = localStorage.getItem("minisLuxuryAuthExpiry")

        if (storedUser && sessionExpiry) {
          const expiryTime = Number.parseInt(sessionExpiry)
          const currentTime = Date.now()

          if (currentTime < expiryTime) {
            setIsAuthenticated(true)
            router.push("/admin")
            return
          } else {
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

    checkAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    // Demo authentication
    const validCredentials = [
      { email: "admin@dripwithminis.com", password: "MinisLuxury2024!" },
      { email: "umar@minisluxury.com", password: "MinisLuxury2024!" },
      { email: "admin@minisluxury.com", password: "AdminPass123!" },
    ]

    const isValid = validCredentials.some((cred) => cred.email === email && cred.password === password)

    if (isValid) {
      const user = {
        id: "1",
        email: email,
        name: email === "umar@minisluxury.com" ? "Muhammed Umar Faruq" : "Admin User",
        role: email === "umar@minisluxury.com" ? "owner" : "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // Set session expiry to 24 hours
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000

      localStorage.setItem("minisLuxuryAuth", JSON.stringify(user))
      localStorage.setItem("minisLuxuryAuthExpiry", expiryTime.toString())

      setIsAuthenticated(true)
      router.push("/admin")
      return true
    }

    return false
  }

  return { isAuthenticated, isLoading, login }
}

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, isLoading: authLoading, login } = useSimpleAuth()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400">Loading...</div>
      </div>
    )
  }

  // If already authenticated, don't show login form
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400">Redirecting to admin...</div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const success = await login(email, password)

      if (success) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged into MINIS LUXURY admin.",
        })
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-12 w-12 text-yellow-400" />
            <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
          </div>
          <p className="text-gray-400">Admin Dashboard Access</p>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <p className="text-center text-gray-400">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <Lock className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@dripwithminis.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link href="/admin/forgot-password">
                  <Button variant="link" className="text-yellow-400 hover:text-yellow-300 p-0 h-auto">
                    Forgot your password?
                  </Button>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>
                  <strong>Admin:</strong> admin@dripwithminis.com / MinisLuxury2024!
                </p>
                <p>
                  <strong>Owner:</strong> umar@minisluxury.com / MinisLuxury2024!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2024 MINIS LUXURY. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
