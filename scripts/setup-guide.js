#!/usr/bin/env node

console.log(`
🌟 MINIS LUXURY - Environment Setup Guide
${"=".repeat(50)}

Let's set up your environment variables step by step!

`)

const fs = require("fs")
const path = require("path")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
const envExists = fs.existsSync(envPath)

console.log(`📁 Checking .env.local file...`)
if (envExists) {
  console.log(`✅ .env.local file exists`)
} else {
  console.log(`❌ .env.local file not found`)
  console.log(`   Creating template file...`)
}

console.log(`
🔧 STEP 1: SUPABASE SETUP
${"─".repeat(30)}

1. Go to: https://supabase.com
2. Click "Start your project" 
3. Sign up/Login with GitHub or email
4. Click "New Project"
5. Choose organization and fill details:
   - Name: "MINIS LUXURY"
   - Database Password: (create a strong password)
   - Region: Choose closest to Nigeria (eu-west-1 or us-east-1)
6. Click "Create new project"
7. Wait for setup to complete (2-3 minutes)

8. Once ready, go to Settings > API
9. Copy these values:

   📋 Project URL: https://your-project-id.supabase.co
   📋 Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   📋 Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

`)

console.log(`
🖼️  STEP 2: CLOUDINARY SETUP  
${"─".repeat(30)}

1. Go to: https://cloudinary.com
2. Click "Sign Up Free"
3. Fill in your details:
   - Email: your-email@example.com
   - Password: (create password)
   - Company: "MINIS LUXURY"
4. Verify your email
5. Go to Dashboard
6. Copy these values:

   📋 Cloud Name: your-cloud-name
   📋 API Key: 123456789012345
   📋 API Secret: abcdefghijklmnopqrstuvwxyz

`)

console.log(`
📝 STEP 3: UPDATE .env.local
${"─".repeat(30)}

Open your .env.local file and replace the placeholder values:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

`)

console.log(`
✅ STEP 4: VERIFY SETUP
${"─".repeat(30)}

After updating .env.local, run:

npm run check-env

If all variables show ✅, you're ready to proceed!

`)

console.log(`
🚀 NEXT STEPS
${"─".repeat(30)}

1. npm run check-env     (verify environment)
2. Setup database schema (copy SQL to Supabase)
3. npm run seed         (populate with sample data)
4. npm run dev          (start development server)

`)

console.log(`
💡 NEED HELP?
${"─".repeat(30)}

- Supabase docs: https://supabase.com/docs
- Cloudinary docs: https://cloudinary.com/documentation
- Contact: hello@dripwithminis.com

${"=".repeat(50)}
`)
