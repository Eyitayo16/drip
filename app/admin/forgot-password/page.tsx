"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validate email exists in our system
      const validEmails = ["umar@minisluxury.com", "admin@minisluxury.com", "muhammed@minisluxury.com"]

      if (!validEmails.includes(email)) {
        setError("No account found with this email address.")
        return
      }

      // Generate reset token and store it
      const resetToken = generateResetToken()
      const resetData = {
        email,
        token: resetToken,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        used: false,
      }

      // Store reset token (in production, this would be in your database)
      localStorage.setItem(`reset_token_${resetToken}`, JSON.stringify(resetData))

      // In production, you would send an actual email here
      console.log("Reset link:", `${window.location.origin}/admin/reset-password?token=${resetToken}`)

      setIsEmailSent(true)
      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      })
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateResetToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Email resent!",
        description: "Check your inbox for the new reset link.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-12 w-12 text-yellow-400" />
              <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
            </div>
            <p className="text-gray-400">Password Reset</p>
          </div>

          {/* Success Card */}
          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/20 rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-gray-300">We've sent a password reset link to:</p>
                <p className="text-yellow-400 font-semibold">{email}</p>
                <p className="text-sm text-gray-400">The link will expire in 15 minutes for security reasons.</p>
              </div>

              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  <strong>Demo Mode:</strong> Check the browser console for the reset link since email service isn't
                  configured.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {isLoading ? "Resending..." : "Resend Email"}
                </Button>

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-12 w-12 text-yellow-400" />
            <h1 className="text-3xl font-bold text-yellow-400">MINIS LUXURY</h1>
          </div>
          <p className="text-gray-400">Reset Your Password</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Forgot Password?</CardTitle>
            <p className="text-center text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2"
                disabled={isLoading}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
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

            {/* Demo Information */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Demo Accounts:</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>umar@minisluxury.com</p>
                <p>admin@minisluxury.com</p>
                <p>muhammed@minisluxury.com</p>
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
