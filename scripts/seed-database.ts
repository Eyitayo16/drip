import { createServerClient } from "@/lib/supabase"
import { defaultSiteSettings } from "@/lib/api/settings"

const supabase = createServerClient()

async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  try {
    // 1. Seed site settings
    console.log("📝 Seeding site settings...")
    const settingsArray = Object.entries(defaultSiteSettings).map(([key, value]) => ({
      key,
      value,
    }))

    const { error: settingsError } = await supabase.from("site_settings").upsert(settingsArray)

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
      },
      {
        name: "Gold Chain Luxury Set",
        category: "Jewelry",
        price: "₦120,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "18k gold-plated statement piece",
        badge: "Limited",
        sort_order: 2,
      },
      {
        name: "MINIS Signature Snapback",
        category: "Accessories",
        price: "₦25,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Custom embroidered premium cap",
        badge: "New Drop",
        sort_order: 3,
      },
      {
        name: "Luxury Tracksuit Set",
        category: "Unisex Fashion",
        price: "₦85,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Italian fabric, Nigerian craftsmanship",
        badge: "Best Seller",
        sort_order: 4,
      },
      {
        name: "Diamond Stud Earrings",
        category: "Jewelry",
        price: "₦75,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Cubic zirconia premium finish",
        badge: "Exclusive",
        sort_order: 5,
      },
      {
        name: "Designer Cargo Pants",
        category: "Fashion",
        price: "₦55,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Military-inspired luxury streetwear",
        badge: "Hot",
        sort_order: 6,
      },
    ]

    const { error: productsError } = await supabase.from("products").upsert(sampleProducts)

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
      },
      {
        name: "David Adeleke",
        role: "Music Executive",
        content: "From red carpet events to casual street looks, MINIS LUXURY delivers excellence every time.",
        rating: 5,
        sort_order: 2,
      },
      {
        name: "Temi Otedola",
        role: "Fashion Influencer",
        content:
          "The personal shopping experience is world-class. Umar has an eye for luxury that's truly exceptional.",
        rating: 5,
        sort_order: 3,
      },
    ]

    const { error: testimonialsError } = await supabase.from("testimonials").upsert(sampleTestimonials)

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
        caption: "New luxury drop! 🔥 #MinisLuxury",
        likes_count: 245,
        sort_order: 1,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post2",
        caption: "Street fashion meets luxury ✨",
        likes_count: 189,
        sort_order: 2,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post3",
        caption: "Behind the scenes styling session 👑",
        likes_count: 312,
        sort_order: 3,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post4",
        caption: "Custom jewelry pieces ✨💎",
        likes_count: 156,
        sort_order: 4,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post5",
        caption: "Client transformation Tuesday 🔥",
        likes_count: 278,
        sort_order: 5,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post6",
        caption: "Luxury streetwear collection 👑",
        likes_count: 203,
        sort_order: 6,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post7",
        caption: "Personal shopping experience ✨",
        likes_count: 167,
        sort_order: 7,
      },
      {
        image_url: "/placeholder.svg?height=300&width=300&text=Post8",
        caption: "Nigerian fashion meets global luxury 🌍",
        likes_count: 234,
        sort_order: 8,
      },
    ]

    const { error: instagramError } = await supabase.from("instagram_posts").upsert(sampleInstagramPosts)

    if (instagramError) {
      console.error("Error seeding Instagram posts:", instagramError)
    } else {
      console.log("✅ Instagram posts seeded successfully")
    }

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error during database seeding:", error)
  }
}

// Run the seeding function
seedDatabase()
