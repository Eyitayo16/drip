"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ResetTokenData {
  email: string
  token: string
  expires: number
  used: boolean
}

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState("")
  const [tokenData, setTokenData] = useState<ResetTokenData | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    setIsValidating(true)

    if (!token) {
      setError("Invalid or missing reset token.")
      setIsValidating(false)
      return
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if token exists in localStorage (in production, this would be a database call)
      const storedData = localStorage.getItem(`reset_token_${token}`)

      if (!storedData) {
        setError("Invalid or expired reset token.")
        setIsValidating(false)
        return
      }

      const resetData: ResetTokenData = JSON.parse(storedData)

      // Check if token is expired
      if (Date.now() > resetData.expires) {
        setError("This reset link has expired. Please request a new one.")
        setIsValidating(false)
        return
      }

      // Check if token has already been used
      if (resetData.used) {
        setError("This reset link has already been used. Please request a new one.")
        setIsValidating(false)
        return
      }

      setTokenData(resetData)
    } catch (error) {
      setError("Failed to validate reset token. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return errors
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const errors = validatePassword(value)
    setValidationErrors(errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }

      // Validate password strength
      const passwordErrors = validatePassword(password)
      if (passwordErrors.length > 0) {
        setError("Please fix the password requirements below.")
        return
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!tokenData) {
        setError("Invalid token data.")
        return
      }

      // Mark token as used
      const updatedTokenData = { ...tokenData, used: true }
      localStorage.setItem(`reset_token_${token}`, JSON.stringify(updatedTokenData))

      // In production, you would update the user's password in the database here
      console.log("Password reset successful for:", tokenData.email)

      // Update stored credentials for demo purposes
      const demoCredentials = [
        { email: "umar@minisluxury.com", password: password },
        { email: "admin@minisluxury.com", password: password },
        { email: "muhammed@minisluxury.com", password: password },
      ]

      localStorage.setItem("minisLuxuryDemoCredentials", JSON.stringify(demoCredentials))

      setIsSuccess(true)
      toast({
        title: "Password Reset Successful!",
        description: "Your password has been updated successfully.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    } catch (error) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Crown className="h-12 w-12 text-yellow-400 mb-4 animate-pulse" />
              <p className="text-gray-300">Validating reset link...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state for invalid/expired tokens
  if (error && !tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-12 w-12 text-yellow-400" />
              <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/20 rounded-full p-3">
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Invalid Reset Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-500 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link href="/admin/forgot-password">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    Request New Reset Link
                  </Button>
                </Link>

                <Link href="/admin/login">
                  <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-12 w-12 text-yellow-400" />
              <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/20 rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Password Reset Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-gray-300">Your password has been successfully updated for:</p>
                <p className="text-yellow-400 font-semibold">{tokenData?.email}</p>
                <p className="text-sm text-gray-400">You will be redirected to the login page in a few seconds.</p>
              </div>

              <Link href="/admin/login">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">Continue to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-12 w-12 text-yellow-400" />
            <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
          </div>
          <p className="text-gray-400">Set New Password</p>
        </div>

        {/* Reset Password Form */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Create New Password</CardTitle>
            <p className="text-center text-gray-400">
              Enter a strong password for: <span className="text-yellow-400">{tokenData?.email}</span>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Password Requirements:</h4>
                  <div className="space-y-1">
                    {[
                      { text: "At least 8 characters", valid: password.length >= 8 },
                      { text: "One uppercase letter", valid: /[A-Z]/.test(password) },
                      { text: "One lowercase letter", valid: /[a-z]/.test(password) },
                      { text: "One number", valid: /\d/.test(password) },
                      { text: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${req.valid ? "bg-green-400" : "bg-gray-500"}`} />
                        <span className={req.valid ? "text-green-400" : "text-gray-400"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${password === confirmPassword ? "bg-green-400" : "bg-red-400"}`}
                  />
                  <span className={password === confirmPassword ? "text-green-400" : "text-red-400"}>
                    {password === confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2"
                disabled={isLoading || validationErrors.length > 0 || password !== confirmPassword}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/admin/login">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
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
