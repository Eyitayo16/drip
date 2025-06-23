"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, MessageCircle, Search, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gold">
            DRIP WITH MINIS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-gold transition-colors">
              About Minis
            </Link>
            <Link href="/shop" className="text-white hover:text-gold transition-colors">
              Shop
            </Link>
            <Link href="/services" className="text-white hover:text-gold transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-white hover:text-gold transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-gold">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-gold">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-gold">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/2349057244762"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gold/20">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-gold transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-gold transition-colors">
                About Minis
              </Link>
              <Link href="/shop" className="text-white hover:text-gold transition-colors">
                Shop
              </Link>
              <Link href="/services" className="text-white hover:text-gold transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-white hover:text-gold transition-colors">
                Contact
              </Link>
              <a
                href="https://wa.me/2349057244762"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
