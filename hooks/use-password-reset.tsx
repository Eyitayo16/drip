"use client"

import { useState } from "react"

interface ResetTokenData {
  email: string
  token: string
  expires: number
  used: boolean
}

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false)

  const sendResetEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validate email exists in our system
      const validEmails = ["umar@minisluxury.com", "admin@minisluxury.com", "muhammed@minisluxury.com"]

      if (!validEmails.includes(email)) {
        return { success: false, message: "No account found with this email address." }
      }

      // Generate reset token and store it
      const resetToken = generateResetToken()
      const resetData: ResetTokenData = {
        email,
        token: resetToken,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        used: false,
      }

      // Store reset token (in production, this would be in your database)
      localStorage.setItem(`reset_token_${resetToken}`, JSON.stringify(resetData))

      // In production, you would send an actual email here
      console.log("Reset link:", `${window.location.origin}/admin/reset-password?token=${resetToken}`)

      return { success: true, message: "Reset email sent successfully." }
    } catch (error) {
      return { success: false, message: "Failed to send reset email. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const validateResetToken = async (
    token: string,
  ): Promise<{ valid: boolean; data?: ResetTokenData; message?: string }> => {
    try {
      if (!token) {
        return { valid: false, message: "Invalid or missing reset token." }
      }

      // Check if token exists in localStorage (in production, this would be a database call)
      const storedData = localStorage.getItem(`reset_token_${token}`)

      if (!storedData) {
        return { valid: false, message: "Invalid or expired reset token." }
      }

      const resetData: ResetTokenData = JSON.parse(storedData)

      // Check if token is expired
      if (Date.now() > resetData.expires) {
        return { valid: false, message: "This reset link has expired. Please request a new one." }
      }

      // Check if token has already been used
      if (resetData.used) {
        return { valid: false, message: "This reset link has already been used. Please request a new one." }
      }

      return { valid: true, data: resetData }
    } catch (error) {
      return { valid: false, message: "Failed to validate reset token. Please try again." }
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Validate token first
      const tokenValidation = await validateResetToken(token)

      if (!tokenValidation.valid || !tokenValidation.data) {
        return { success: false, message: tokenValidation.message || "Invalid token." }
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark token as used
      const updatedTokenData = { ...tokenValidation.data, used: true }
      localStorage.setItem(`reset_token_${token}`, JSON.stringify(updatedTokenData))

      // In production, you would update the user's password in the database here
      console.log("Password reset successful for:", tokenValidation.data.email)

      // Update stored credentials for demo purposes
      const demoCredentials = [
        { email: "umar@minisluxury.com", password: newPassword },
        { email: "admin@minisluxury.com", password: newPassword },
        { email: "muhammed@minisluxury.com", password: newPassword },
      ]

      localStorage.setItem("minisLuxuryDemoCredentials", JSON.stringify(demoCredentials))

      return { success: true, message: "Password reset successfully." }
    } catch (error) {
      return { success: false, message: "Failed to reset password. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
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

  return {
    isLoading,
    sendResetEmail,
    validateResetToken,
    resetPassword,
    validatePassword,
  }
}
