// Simple environment variables checker
console.log("🔍 Checking environment variables...\n")

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
]

let allPresent = true

requiredVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: Missing`)
    allPresent = false
  }
})

console.log("\n" + "=".repeat(50))

if (allPresent) {
  console.log("🎉 All environment variables are set!")
  console.log("You can now run: npm run seed")
} else {
  console.log("⚠️  Some environment variables are missing.")
  console.log("Please check your .env.local file.")
}

console.log("=".repeat(50))
