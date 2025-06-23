import Hero from "@/components/hero"
import FeaturedBrands from "@/components/featured-brands"
import TrendingNow from "@/components/trending-now"
import InstagramFeed from "@/components/instagram-feed"
import Testimonials from "@/components/testimonials"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <FeaturedBrands />
      <TrendingNow />
      <InstagramFeed />
      <Testimonials />
      <Footer />
    </div>
  )
}
