"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    title: "Celebrity Stylist",
    content:
      "DRIP WITH MINIS has been my go-to for sourcing rare pieces for my A-list clients. Their attention to detail and ability to find the impossible is unmatched.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Marcus K.",
    title: "Fashion Entrepreneur",
    content:
      "The personal shopping experience is next level. They understand luxury fashion like no one else and always deliver pieces that exceed expectations.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Isabella R.",
    title: "Fashion Influencer",
    content:
      "From runway exclusives to vintage finds, Minis has transformed my wardrobe. The service is impeccable and the pieces are always authentic.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "David L.",
    title: "Art Collector",
    content:
      "Working with DRIP WITH MINIS feels like having a personal curator for fashion. They source pieces that are true works of art.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="text-gold">VIP Clients</span> Say
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Trusted by celebrities, influencers, and fashion connoisseurs worldwide
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-gold fill-current" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </blockquote>

            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mr-4">
                <span className="text-gold font-bold text-lg">{testimonials[currentTestimonial].name.charAt(0)}</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                <p className="text-gold text-sm">{testimonials[currentTestimonial].title}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-white hover:text-gold"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-white hover:text-gold"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-gold" : "bg-gray-600"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
