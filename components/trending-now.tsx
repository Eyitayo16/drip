import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"

const trendingItems = [
  {
    id: 1,
    name: "Chanel Classic Flap Bag",
    brand: "Chanel",
    price: "$8,500",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Brand New",
    rarity: "Limited Edition",
  },
  {
    id: 2,
    name: "Rick Owens DRKSHDW Sneakers",
    brand: "Rick Owens",
    price: "$1,200",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Excellent",
    rarity: "Rare Find",
  },
  {
    id: 3,
    name: "Jacquemus Le Bambino Bag",
    brand: "Jacquemus",
    price: "$650",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Brand New",
    rarity: "Hot Drop",
  },
  {
    id: 4,
    name: "Chrome Hearts Hoodie",
    brand: "Chrome Hearts",
    price: "$2,800",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Brand New",
    rarity: "Exclusive",
  },
  {
    id: 5,
    name: "Dior Saddle Bag",
    brand: "Dior",
    price: "$4,200",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Excellent",
    rarity: "Vintage",
  },
  {
    id: 6,
    name: "Off-White Industrial Belt",
    brand: "Off-White",
    price: "$320",
    image: "/placeholder.svg?height=400&width=300",
    condition: "Brand New",
    rarity: "Trending",
  },
]

export default function TrendingNow() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trending <span className="text-gold">Now</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Hot items, rare drops, and exclusive deals curated by our fashion experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold text-black px-3 py-1 rounded-full text-xs font-semibold">{item.rarity}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:text-gold bg-black/50 hover:bg-black/70"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <p className="text-gold text-sm font-medium">{item.brand}</p>
                  <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">{item.price}</span>
                  <span className="text-green-400 text-sm">{item.condition}</span>
                </div>

                <a href="https://wa.me/2349057244762" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    DM to Purchase
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black px-8">
            View All Items
          </Button>
        </div>
      </div>
    </section>
  )
}
