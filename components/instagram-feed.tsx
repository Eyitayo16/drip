import Image from "next/image"
import { Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const instagramPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Client styling session for Milan Fashion Week ✨",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Rare Chanel find just landed 🔥",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Behind the scenes: Personal shopping in Paris",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Chrome Hearts exclusive drop 💎",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    caption: "VIP client wardrobe refresh complete",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    caption: "Rick Owens runway piece secured 🖤",
  },
]

export default function InstagramFeed() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="h-8 w-8 text-gold mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Follow <span className="text-gold">@MinisLuxury</span>
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get an inside look at our latest finds, styling sessions, and exclusive drops
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {instagramPosts.map((post) => (
            <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="https://instagram.com/MinisLuxury" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow @MinisLuxury
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
