import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "MINIS LUXURY - Where Nigerian Street Fashion Meets Global Luxury",
  description:
    "Premium fashion curation and personal shopping services by Muhammed Umar Faruq. Luxury streetwear, jewelry, and exclusive styling for the fashion-forward.",
  keywords: "luxury fashion, Nigerian fashion, personal shopping, streetwear, jewelry, styling services",
  authors: [{ name: "Muhammed Umar Faruq" }],
  openGraph: {
    title: "MINIS LUXURY - Premium Fashion & Personal Shopping",
    description: "Where Nigerian Street Fashion Meets Global Luxury",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MINIS LUXURY",
    description: "Where Nigerian Street Fashion Meets Global Luxury",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
