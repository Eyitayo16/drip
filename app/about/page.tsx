import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MessageCircle, Star, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Meet <span className="text-gold">Minis</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The visionary behind DRIP WITH MINIS, transforming the luxury fashion landscape one exclusive piece at a
                time. From humble beginnings to becoming the most trusted name in high-end personal shopping.
              </p>
              <a href="https://wa.me/2349057244762" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Connect with Minis
                </Button>
              </a>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=450"
                  alt="Minis - Founder of DRIP WITH MINIS"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our <span className="text-gold">Vision</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Making luxury accessible yet exclusive. We believe that true luxury isn't just about owning beautiful
              things—it's about the experience, the story, and the confidence that comes with wearing pieces that speak
              to your soul.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Authenticity</h3>
                <p className="text-gray-400">Every piece is verified and authenticated by our expert team</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Global Sourcing</h3>
                <p className="text-gray-400">We source from the world's most exclusive boutiques and ateliers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Elite Taste</h3>
                <p className="text-gray-400">Curated with an eye for the extraordinary and rare</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              The <span className="text-gold">Story</span>
            </h2>

            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <p>
                It all started with a passion for fashion and an eye for the extraordinary. Minis began her journey in
                the fashion world with a simple belief: everyone deserves access to pieces that make them feel powerful,
                confident, and uniquely themselves.
              </p>

              <p>
                What began as helping friends find rare designer pieces quickly evolved into something much bigger. Word
                spread about Minis' ability to source the impossible—that sold-out Chanel bag, the limited edition Rick
                Owens piece, the vintage Dior that everyone was searching for.
              </p>

              <p>
                Today, DRIP WITH MINIS serves an exclusive clientele of celebrities, fashion influencers, and discerning
                individuals who understand that true luxury lies in the details, the story, and the experience of owning
                something truly special.
              </p>

              <p className="text-gold font-semibold">"Luxury is not a label — it's a lifestyle. Drip different."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Behind the <span className="text-gold">Scenes</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get an exclusive look at our sourcing process and the dedication that goes into finding each perfect piece
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square relative rounded-lg overflow-hidden group">
                <Image
                  src={`/placeholder.svg?height=400&width=400`}
                  alt={`Behind the scenes ${i}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
