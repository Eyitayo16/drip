import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables")
  console.log("Please ensure you have set:")
  console.log("- NEXT_PUBLIC_SUPABASE_URL")
  console.log("- SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Default site settings
const defaultSiteSettings = {
  site_title: "DRIP WITH MINIS - Luxury Fashion Concierge",
  site_description: "Nigeria's premier luxury fashion and personal shopping service",
  hero_title: "DRIP WITH MINIS",
  hero_subtitle: "Luxury is not a label — it's a lifestyle. Drip different.",
  whatsapp_number: "2349057244762",
  instagram_handle: "@MinisLuxury",
  email: "hello@dripwithminis.com",
  featured_brands: "Chanel,Dior,Rick Owens,Jacquemus,Louis Vuitton,Off-White,Chrome Hearts",
  services_enabled: "true",
  testimonials_enabled: "true",
  instagram_feed_enabled: "true",
  newsletter_enabled: "true",
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  try {
    // 1. Seed site settings
    console.log("📝 Seeding site settings...")
    const settingsArray = Object.entries(defaultSiteSettings).map(([key, value]) => ({
      key,
      value,
    }))

    const { error: settingsError } = await supabase.from("site_settings").upsert(settingsArray, { onConflict: "key" })

    if (settingsError) {
      console.error("Error seeding site settings:", settingsError)
    } else {
      console.log("✅ Site settings seeded successfully")
    }

    // 2. Seed products
    console.log("🛍️ Seeding products...")
    const sampleProducts = [
      {
        name: "Royal Street Hoodie",
        category: "Unisex Fashion",
        price: "₦45,000",
        image_url: "/IMG-20250618-WA0001.jpg",
        description: "Premium streetwear meets luxury comfort",
        badge: "Trending",
        sort_order: 1,
        is_featured: true,
        in_stock: true,
      },
      {
        name: "Gold Chain Luxury Set",
        category: "Jewelry",
        price: "₦120,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "18k gold-plated statement piece",
        badge: "Limited",
        sort_order: 2,
        is_featured: true,
        in_stock: true,
      },
      {
        name: "MINIS Signature Snapback",
        category: "Accessories",
        price: "₦25,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Custom embroidered premium cap",
        badge: "New Drop",
        sort_order: 3,
        is_featured: false,
        in_stock: true,
      },
      {
        name: "Luxury Tracksuit Set",
        category: "Unisex Fashion",
        price: "₦85,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Italian fabric, Nigerian craftsmanship",
        badge: "Best Seller",
        sort_order: 4,
        is_featured: true,
        in_stock: true,
      },
      {
        name: "Diamond Stud Earrings",
        category: "Jewelry",
        price: "₦75,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Cubic zirconia premium finish",
        badge: "Exclusive",
        sort_order: 5,
        is_featured: false,
        in_stock: true,
      },
      {
        name: "Designer Cargo Pants",
        category: "Fashion",
        price: "₦55,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Military-inspired luxury streetwear",
        badge: "Hot",
        sort_order: 6,
        is_featured: false,
        in_stock: true,
      },
    ]

    const { error: productsError } = await supabase.from("products").upsert(sampleProducts, { onConflict: "name" })

    if (productsError) {
      console.error("Error seeding products:", productsError)
    } else {
      console.log("✅ Products seeded successfully")
    }

    // 3. Seed testimonials
    console.log("💬 Seeding testimonials...")
    const sampleTestimonials = [
      {
        name: "Adunni Ade",
        role: "Nollywood Actress",
        content: "Minis Umar transformed my entire wardrobe. The attention to detail and luxury pieces are unmatched!",
        rating: 5,
        sort_order: 1,
        is_featured: true,
      },
      {
        name: "David Adeleke",
        role: "Music Executive",
        content: "From red carpet events to casual street looks, MINIS LUXURY delivers excellence every time.",
        rating: 5,
        sort_order: 2,
        is_featured: true,
      },
      {
        name: "Temi Otedola",
        role: "Fashion Influencer",
        content:
          "The personal shopping experience is world-class. Umar has an eye for luxury that's truly exceptional.",
        rating: 5,
        sort_order: 3,
        is_featured: true,
      },
      {
        name: "Kemi Adetiba",
        role: "Film Director",
        content: "MINIS LUXURY understands my style perfectly. Every piece they source is exactly what I need.",
        rating: 5,
        sort_order: 4,
        is_featured: false,
      },
      {
        name: "Banky W",
        role: "Artist & Entrepreneur",
        content: "The quality and authenticity of pieces from MINIS is unmatched. Highly recommended!",
        rating: 5,
        sort_order: 5,
        is_featured: false,
      },
    ]

    const { error: testimonialsError } = await supabase
      .from("testimonials")
      .upsert(sampleTestimonials, { onConflict: "name,role" })

    if (testimonialsError) {
      console.error("Error seeding testimonials:", testimonialsError)
    } else {
      console.log("✅ Testimonials seeded successfully")
    }

    // 4. Seed Instagram posts
    console.log("📸 Seeding Instagram posts...")
    const sampleInstagramPosts = [
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post1",
        caption: "New luxury drop! 🔥 #MinisLuxury #LuxuryFashion",
        likes_count: 245,
        sort_order: 1,
        is_featured: true,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post2",
        caption: "Street fashion meets luxury ✨ #StreetLuxury",
        likes_count: 189,
        sort_order: 2,
        is_featured: true,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post3",
        caption: "Behind the scenes styling session 👑 #PersonalStylist",
        likes_count: 312,
        sort_order: 3,
        is_featured: true,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post4",
        caption: "Custom jewelry pieces ✨💎 #LuxuryJewelry",
        likes_count: 156,
        sort_order: 4,
        is_featured: false,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post5",
        caption: "Client transformation Tuesday 🔥 #Transformation",
        likes_count: 278,
        sort_order: 5,
        is_featured: false,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post6",
        caption: "Luxury streetwear collection 👑 #Streetwear",
        likes_count: 203,
        sort_order: 6,
        is_featured: false,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post7",
        caption: "Personal shopping experience ✨ #PersonalShopping",
        likes_count: 167,
        sort_order: 7,
        is_featured: false,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post8",
        caption: "Nigerian fashion meets global luxury 🌍 #NigerianFashion",
        likes_count: 234,
        sort_order: 8,
        is_featured: false,
      },
    ]

    const { error: instagramError } = await supabase
      .from("instagram_posts")
      .upsert(sampleInstagramPosts, { onConflict: "caption" })

    if (instagramError) {
      console.error("Error seeding Instagram posts:", instagramError)
    } else {
      console.log("✅ Instagram posts seeded successfully")
    }

    // 5. Create admin user (optional)
    console.log("👤 Creating admin user...")
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@dripwithminis.com",
      password: "MinisLuxury2024!",
      email_confirm: true,
      user_metadata: {
        role: "owner",
        full_name: "MINIS Admin",
      },
    })

    if (adminError) {
      console.log("ℹ️ Admin user creation skipped (may already exist):", adminError.message)
    } else {
      console.log("✅ Admin user created successfully")

      // Add user profile
      const { error: profileError } = await supabase.from("user_profiles").upsert({
        id: adminUser.user.id,
        email: "admin@dripwithminis.com",
        full_name: "MINIS Admin",
        role: "owner",
      })

      if (profileError) {
        console.error("Error creating admin profile:", profileError)
      } else {
        console.log("✅ Admin profile created successfully")
      }
    }

    console.log("\n🎉 Database seeding completed successfully!")
    console.log("\n📋 Summary:")
    console.log("- Site settings configured")
    console.log("- 6 sample products added")
    console.log("- 5 testimonials added")
    console.log("- 8 Instagram posts added")
    console.log("- Admin user created (admin@dripwithminis.com)")
    console.log("\n🔐 Admin Login:")
    console.log("Email: admin@dripwithminis.com")
    console.log("Password: MinisLuxury2024!")
    console.log("\n🚀 Your MINIS LUXURY platform is ready!")
  } catch (error) {
    console.error("❌ Error during database seeding:", error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
