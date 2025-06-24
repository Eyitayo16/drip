# MINIS LUXURY - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary Configuration  
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Check Environment Variables

\`\`\`bash
npm run check-env
\`\`\`

### 4. Setup Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy the SQL from `scripts/supabase-schema.sql`
3. Run it in your Supabase SQL Editor

### 5. Seed Database

\`\`\`bash
npm run seed
\`\`\`

### 6. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

## 🔐 Admin Access

After seeding, you can access the admin panel at `/admin` with:

- **Email:** admin@dripwithminis.com
- **Password:** MinisLuxury2024!

## 🛠️ Troubleshooting

### Seeding Issues

1. **Environment Variables Missing:**
   \`\`\`bash
   npm run check-env
   \`\`\`

2. **Database Connection Issues:**
   - Check your Supabase URL and keys
   - Ensure your Supabase project is active

3. **Permission Errors:**
   - Verify your service role key has admin permissions
   - Check RLS policies in Supabase

### Common Errors

- **"Cannot find module"**: Run `npm install`
- **"Invalid API key"**: Check your environment variables
- **"Table does not exist"**: Run the SQL schema first

## 📞 Support

For issues, contact: hello@dripwithminis.com
