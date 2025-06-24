"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Crown, Lock, Eye, EyeOff, Shield, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginCredentials {
  email: string
  password: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "editor"
  avatar_url?: string
  last_login: string
}

// Demo users for authentication
const DEMO_USERS: Record<string, AdminUser & { password: string }> = {
  "admin@dripwithminis.com": {
    id: "1",
    name: "Muhammed Umar Faruq",
    email: "admin@dripwithminis.com",
    password: "MinisLuxury2024!",
    role: "owner",
    avatar_url: "/placeholder.svg?height=100&width=100",
    last_login: new Date().toISOString(),
  },
  "editor@dripwithminis.com": {
    id: "2",
    name: "Fashion Editor",
    email: "editor@dripwithminis.com",
    password: "Editor2024!",
    role: "editor",
    avatar_url: "/placeholder.svg?height=100&width=100",
    last_login: new Date().toISOString(),
  },
  "manager@dripwithminis.com": {
    id: "3",
    name: "Store Manager",
    email: "manager@dripwithminis.com",
    password: "Manager2024!",
    role: "admin",
    avatar_url: "/placeholder.svg?height=100&width=100",
    last_login: new Date().toISOString(),
  },
}

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)

  useEffect(() => {
    setMounted(true)
    checkExistingAuth()
    checkLockout()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLocked && lockoutTime > 0) {
      interval = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isLocked, lockoutTime])

  const checkExistingAuth = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("minisLuxuryAuth")
      const sessionExpiry = localStorage.getItem("minisLuxuryAuthExpiry")

      if (storedUser && sessionExpiry) {
        const expiryTime = Number.parseInt(sessionExpiry)
        const currentTime = Date.now()

        if (currentTime < expiryTime) {
          router.push("/admin")
          return
        } else {
          localStorage.removeItem("minisLuxuryAuth")
          localStorage.removeItem("minisLuxuryAuthExpiry")
        }
      }
    }
  }

  const checkLockout = () => {
    if (typeof window !== "undefined") {
      const attempts = localStorage.getItem("loginAttempts")
      const lockoutEnd = localStorage.getItem("lockoutEnd")

      if (attempts) {
        setLoginAttempts(Number.parseInt(attempts))
      }

      if (lockoutEnd) {
        const lockoutEndTime = Number.parseInt(lockoutEnd)
        const currentTime = Date.now()

        if (currentTime < lockoutEndTime) {
          setIsLocked(true)
          setLockoutTime(Math.ceil((lockoutEndTime - currentTime) / 1000))
        } else {
          localStorage.removeItem("lockoutEnd")
          localStorage.removeItem("loginAttempts")
        }
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Please wait ${lockoutTime} seconds before trying again.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials
      const user = DEMO_USERS[credentials.email.toLowerCase()]

      if (!user || user.password !== credentials.password) {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (typeof window !== "undefined") {
          localStorage.setItem("loginAttempts", newAttempts.toString())
        }

        if (newAttempts >= 5) {
          const lockoutEnd = Date.now() + 300000 // 5 minutes
          setIsLocked(true)
          setLockoutTime(300)

          if (typeof window !== "undefined") {
            localStorage.setItem("lockoutEnd", lockoutEnd.toString())
          }

          toast({
            title: "Account Locked",
            description: "Too many failed attempts. Account locked for 5 minutes.",
            variant: "destructive",
          })
        } else {
          setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`)
        }
        return
      }

      // Successful login
      const sessionExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      const userWithoutPassword = { ...user }
      delete (userWithoutPassword as any).password

      if (typeof window !== "undefined") {
        localStorage.setItem("minisLuxuryAuth", JSON.stringify(userWithoutPassword))
        localStorage.setItem("minisLuxuryAuthExpiry", sessionExpiry.toString())
        localStorage.removeItem("loginAttempts")
        localStorage.removeItem("lockoutEnd")
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      })

      router.push("/admin")
    } catch (error) {
      setError("Login failed. Please try again.")
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const fillDemoCredentials = (userType: "owner" | "admin" | "editor") => {
    const demoUser = Object.values(DEMO_USERS).find((user) => user.role === userType)
    if (demoUser) {
      setCredentials({
        email: demoUser.email,
        password: demoUser.password,
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 rounded-full p-4">
                <Crown className="h-12 w-12 text-black" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">MINIS LUXURY</CardTitle>
            <p className="text-gray-600 mt-2">Admin Dashboard Access</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Secure Authentication</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLocked && (
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Account temporarily locked. Please wait {Math.floor(lockoutTime / 60)}:
                  {(lockoutTime % 60).toString().padStart(2, "0")} before trying again.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading || isLocked}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading || isLocked}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <Separator />

            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">Demo Accounts:</p>
              <div className="grid gap-2">
                <Button
                  onClick={() => fillDemoCredentials("owner")}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isLocked}
                  className="justify-start"
                >
                  <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                  Owner Access
                </Button>
                <Button
                  onClick={() => fillDemoCredentials("admin")}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isLocked}
                  className="justify-start"
                >
                  <Shield className="h-4 w-4 mr-2 text-blue-500" />
                  Admin Access
                </Button>
                <Button
                  onClick={() => fillDemoCredentials("editor")}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isLocked}
                  className="justify-start"
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Editor Access
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Secure admin access for MINIS LUXURY website management</p>
              <p className="text-xs text-gray-400 mt-1">Session expires after 24 hours of inactivity</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Session Management</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Role-Based Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
