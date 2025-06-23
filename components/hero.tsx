"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageCircle, Calendar, ShoppingBag } from "lucide-react"

const heroSlides = [
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Luxury is not a label",
    subtitle: "it's a lifestyle. Drip different.",
    description: "Exclusive access to the world's most coveted designer pieces",
  },
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Personal Shopping",
    subtitle: "Redefined",
    description: "Your dedicated fashion concierge for high-end designer finds",
  },
  {
    image: "/placeholder.svg?height=800&width=1200",
    title: "Rare Designer Finds",
    subtitle: "Sourced Globally",
    description: "From runway to your wardrobe - we make the impossible possible",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              {heroSlides[currentSlide].title}
              <br />
              <span className="text-gold">{heroSlides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">{heroSlides[currentSlide].description}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-4 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop The Drip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 text-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a Stylist
              </Button>
              <a href="https://wa.me/2349057244762" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Message Us on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gold"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gold"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-gold" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
