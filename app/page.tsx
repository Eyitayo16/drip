"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, MessageCircle, Star, ShoppingBag, Crown, Sparkles, MapPin, ChevronRight } from "lucide-react"
import Image from "next/image"
import { getProducts } from "@/lib/api/products"
import { getTestimonials } from "@/lib/api/testimonials"
import { getSiteSettings } from "@/lib/api/settings"
import type { Database } from "@/types/supabase"

type Product = Database["public"]["Tables"]["products"]["Row"]
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]

export default function MinisLuxuryLanding() {
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, testimonialsData, settingsData] = await Promise.all([
        getProducts(true), // Only active products
        getTestimonials(true), // Only active testimonials
        getSiteSettings(),
      ])

      setProducts(productsData)
      setTestimonials(testimonialsData)
      setSiteSettings(settingsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  const handleWhatsAppProduct = (productName: string) => {
    const message = `Hello ${siteSettings.founder_name || "Minis Umar"}! I want to get this product ${productName}.`
    const whatsappUrl = `https://wa.me/${siteSettings.whatsapp_number || "2349057244762"}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleWhatsAppBooking = () => {
    const message = `Hi ${siteSettings.founder_name || "Minis Umar"}! I'd like to book a personal shopping session.`
    const whatsappUrl = `https://wa.me/${siteSettings.whatsapp_number || "2349057244762"}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl">Loading luxury experience...</p>
        </div>
      </div>
    )
  }

  // Use dynamic data from Supabase
  const brandName = siteSettings.brand_name || "MINIS LUXURY"
  const tagline = siteSettings.tagline || "Where Nigerian Street Fashion Meets Global Luxury"
  const heroTitle = siteSettings.hero_title || "MINIS LUXURY"
  const heroSubtitle = siteSettings.hero_subtitle || "Where Nigerian Street Fashion Meets Global Luxury"
  const founderName = siteSettings.founder_name || "Muhammed Umar Faruq"
  const founderTitle = siteSettings.founder_title || "Founder & Creative Director"
  const aboutText =
    siteSettings.about_text || "From the vibrant streets of Nigeria to the global luxury fashion scene..."
  const instagramHandle = siteSettings.instagram_handle || "@Minis_Luxury"

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating WhatsApp Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => handleWhatsAppProduct("General Inquiry")}
          className="bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-2xl"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="MINIS LUXURY Fashion Models"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 font-light"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 text-lg"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg"
              onClick={() => document.getElementById("personal-shopping")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Book Personal Shopper
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-lg blur-xl" />
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Muhammed Umar Faruq - Founder"
                width={500}
                height={600}
                className="rounded-lg relative z-10 shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">Meet {founderName}</h2>
                <p className="text-xl text-gray-300 mb-6">{founderTitle}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-4 text-gray-300 leading-relaxed"
              >
                <p>{aboutText}</p>
                <p>
                  With over 8 years of experience in luxury fashion curation and personal styling, Umar has dressed
                  celebrities, executives, and fashion-forward individuals across Africa and beyond.
                </p>
                <p>
                  His vision: to bridge the gap between authentic Nigerian street culture and international luxury
                  standards, creating pieces that tell stories and make statements.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex gap-4 pt-4"
              >
                <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                  8+ Years Experience
                </Badge>
                <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                  500+ Happy Clients
                </Badge>
                <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                  Celebrity Stylist
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">Luxury Collections</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Curated pieces that define elegance, express individuality, and celebrate the fusion of cultures
            </p>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="bg-black border-gray-800 overflow-hidden hover:border-yellow-400/50 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-400 text-black font-semibold">{product.badge}</Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-yellow-400 mb-1">{product.category}</p>
                        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                        <p className="text-2xl font-bold text-yellow-400">{product.price}</p>
                      </div>

                      <Button
                        onClick={() => handleWhatsAppProduct(product.name)}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                        size="lg"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 text-yellow-400/50 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">New luxury collections coming soon...</p>
              <Button
                onClick={handleWhatsAppBooking}
                variant="outline"
                className="mt-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Get Notified
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Personal Shopping Section */}
      <section id="personal-shopping" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">VIP Personal Shopping</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience luxury fashion curation tailored exclusively for you. From red carpet events to everyday
              elegance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 rounded-full p-2 mt-1">
                    <Crown className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">VIP Styling Sessions</h3>
                    <p className="text-gray-400">One-on-one consultations to define your signature style</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 rounded-full p-2 mt-1">
                    <Sparkles className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Event & Occasion Styling</h3>
                    <p className="text-gray-400">Perfect looks for weddings, galas, premieres, and special events</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 rounded-full p-2 mt-1">
                    <ShoppingBag className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Rare Item Sourcing</h3>
                    <p className="text-gray-400">Access to exclusive pieces from global luxury brands</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleWhatsAppBooking}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Book Your Session
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-lg blur-xl" />
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Personal Shopping Experience"
                width={400}
                height={500}
                className="rounded-lg relative z-10 shadow-2xl w-full"
              />
            </motion.div>
          </div>

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-8">What Our VIP Clients Say</h3>
              <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-300 mb-4 italic">
                    "{testimonials[currentTestimonial]?.content || "Loading testimonial..."}"
                  </p>
                  <div>
                    <p className="font-bold text-white">{testimonials[currentTestimonial]?.name || "Client"}</p>
                    <p className="text-sm text-yellow-400">{testimonials[currentTestimonial]?.role || "VIP Client"}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">Daily Luxury Drops</h2>
            <p className="text-xl text-gray-300 mb-8">
              Follow {instagramHandle} for the latest collections and style inspiration
            </p>
            <Button
              onClick={() => window.open(`https://instagram.com/${instagramHandle.replace("@", "")}`, "_blank")}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              size="lg"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow Us on Instagram
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Post${item}`}
                  alt={`Instagram Post ${item}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">Get In Touch</h2>
            <p className="text-xl text-gray-300">
              Ready to elevate your style? Let's create something extraordinary together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3">
                  <MessageCircle className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-white">WhatsApp</p>
                  <p className="text-gray-400">{siteSettings.whatsapp_number || "+234 905 724 4762"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3">
                  <Instagram className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-white">Instagram</p>
                  <p className="text-gray-400">{instagramHandle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3">
                  <MapPin className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-white">Location</p>
                  <p className="text-gray-400">Lagos, Nigeria</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Tell us about your style goals..."
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      size="lg"
                    >
                      Send Message
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">{brandName}</h3>
            </div>
            <p className="text-gray-400 mb-6">{tagline}</p>
            <div className="flex justify-center gap-6 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://instagram.com/${instagramHandle.replace("@", "")}`, "_blank")}
                className="text-gray-400 hover:text-yellow-400"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleWhatsAppProduct("General Inquiry")}
                className="text-gray-400 hover:text-yellow-400"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 MINIS LUXURY. All rights reserved. | Designed with luxury in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
