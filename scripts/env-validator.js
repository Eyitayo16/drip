#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log(`
🔍 MINIS LUXURY - Environment Validator
${"=".repeat(50)}
`)

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")

if (!fs.existsSync(envPath)) {
  console.log(`❌ .env.local file not found!`)
  console.log(`
📝 SOLUTION:
1. Create a .env.local file in your project root
2. Copy the template from the project
3. Replace placeholder values with real credentials

Run: npm run setup-guide
  `)
  process.exit(1)
}

// Load environment variables
require("dotenv").config({ path: envPath })

const requiredVars = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Your Supabase project URL",
    example: "https://abcdefgh.supabase.co",
    validate: (val) => val && val.includes("supabase.co"),
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Supabase anonymous key",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    validate: (val) => val && val.startsWith("eyJ"),
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    description: "Supabase service role key",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    validate: (val) => val && val.startsWith("eyJ"),
  },
  {
    name: "CLOUDINARY_CLOUD_NAME",
    description: "Your Cloudinary cloud name",
    example: "minis-luxury",
    validate: (val) => val && val.length > 3,
  },
  {
    name: "CLOUDINARY_API_KEY",
    description: "Cloudinary API key",
    example: "123456789012345",
    validate: (val) => val && /^\d+$/.test(val),
  },
  {
    name: "CLOUDINARY_API_SECRET",
    description: "Cloudinary API secret",
    example: "abcdefghijklmnopqrstuvwxyz",
    validate: (val) => val && val.length > 10,
  },
]

let allValid = true
let missingCount = 0
let invalidCount = 0

requiredVars.forEach((varConfig) => {
  const value = process.env[varConfig.name]

  if (!value) {
    console.log(`❌ ${varConfig.name}: Missing`)
    console.log(`   📝 ${varConfig.description}`)
    console.log(`   💡 Example: ${varConfig.example}`)
    console.log(``)
    allValid = false
    missingCount++
  } else if (!varConfig.validate(value)) {
    console.log(`⚠️  ${varConfig.name}: Invalid format`)
    console.log(`   📝 ${varConfig.description}`)
    console.log(`   💡 Example: ${varConfig.example}`)
    console.log(`   🔍 Current: ${value.substring(0, 20)}...`)
    console.log(``)
    allValid = false
    invalidCount++
  } else {
    console.log(`✅ ${varConfig.name}: Valid`)
  }
})

console.log(`${"=".repeat(50)}`)

if (allValid) {
  console.log(`🎉 All environment variables are properly configured!`)
  console.log(`
🚀 NEXT STEPS:
1. npm run seed     (populate database)
2. npm run dev      (start development)
  `)
} else {
  console.log(`⚠️  Configuration Issues Found:`)
  if (missingCount > 0) {
    console.log(`   - ${missingCount} missing variables`)
  }
  if (invalidCount > 0) {
    console.log(`   - ${invalidCount} invalid variables`)
  }

  console.log(`
🔧 SOLUTIONS:
1. Run: npm run setup-guide
2. Follow the step-by-step instructions
3. Update your .env.local file
4. Run this validator again
  `)
}

console.log(`${"=".repeat(50)}`)
