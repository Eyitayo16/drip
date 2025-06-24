"use client"

import { CheckCircle, XCircle } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({ password, className = "" }: PasswordStrengthIndicatorProps) {
  const requirements = [
    { text: "At least 8 characters", valid: password.length >= 8 },
    { text: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { text: "One lowercase letter", valid: /[a-z]/.test(password) },
    { text: "One number", valid: /\d/.test(password) },
    { text: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const validCount = requirements.filter((req) => req.valid).length
  const strength = validCount / requirements.length

  const getStrengthColor = () => {
    if (strength < 0.4) return "bg-red-500"
    if (strength < 0.8) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (strength < 0.4) return "Weak"
    if (strength < 0.8) return "Medium"
    return "Strong"
  }

  if (!password) return null

  return (
    <div className={`bg-gray-900 p-3 rounded-lg border border-gray-600 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-300">Password Strength</h4>
        <span
          className={`text-sm font-medium ${
            strength < 0.4 ? "text-red-400" : strength < 0.8 ? "text-yellow-400" : "text-green-400"
          }`}
        >
          {getStrengthText()}
        </span>
      </div>

      {/* Strength Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength * 100}%` }}
        />
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.valid ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-gray-500" />
            )}
            <span className={req.valid ? "text-green-400" : "text-gray-400"}>{req.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
