"use client"

import { useEffect, useRef } from "react"

const brands = [
  { name: "Chanel", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Dior", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Rick Owens", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Jacquemus", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Louis Vuitton", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Off-White", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Chrome Hearts", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Balenciaga", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Bottega Veneta", logo: "/placeholder.svg?height=80&width=120" },
  { name: "Saint Laurent", logo: "/placeholder.svg?height=80&width=120" },
]

export default function FeaturedBrands() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 1
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-gold">Luxury Brands</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We source from the world's most prestigious fashion houses and emerging luxury designers
          </p>
        </div>

        <div ref={scrollRef} className="flex overflow-hidden space-x-12 py-8" style={{ scrollBehavior: "auto" }}>
          {/* Duplicate brands for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-40 h-20 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <div className="text-white font-semibold text-sm text-center px-4">{brand.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
