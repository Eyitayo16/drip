import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gold/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gold mb-4">DRIP WITH MINIS</h3>
            <p className="text-gray-300 mb-6 max-w-md">"Luxury is not a label — it's a lifestyle. Drip different."</p>
            <p className="text-gray-400 text-sm mb-6">
              The biggest and best fashion concierge and personal shopping service for high-end designer items. Working
              with high-net-worth clients, fashion lovers, and celebrities worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/MinisLuxury"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/2349057244762"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-gold transition-colors">
                  About Minis
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">VIP Personal Shopping</span>
              </li>
              <li>
                <span className="text-gray-400">Capsule Closet Styling</span>
              </li>
              <li>
                <span className="text-gray-400">Event Looks</span>
              </li>
              <li>
                <span className="text-gray-400">Travel Wardrobe</span>
              </li>
              <li>
                <span className="text-gray-400">Rare Designer Finds</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gold/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center text-gray-400">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>+234 905 724 4762</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Instagram className="h-4 w-4 mr-2" />
                <span>@MinisLuxury</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">© 2024 DRIP WITH MINIS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
