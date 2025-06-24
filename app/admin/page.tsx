"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trash2,
  Edit,
  Plus,
  Upload,
  Star,
  Instagram,
  Settings,
  ShoppingBag,
  MessageSquare,
  User,
  ImageIcon,
  Crown,
  Eye,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Palette,
  Layout,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { AdminHeader } from "@/components/admin/admin-header"
import { CloudinaryImageManager } from "@/components/admin/cloudinary-image-manager"

// Enhanced types for comprehensive data management
interface Product {
  id: string
  name: string
  category: string
  price: string
  image?: string
  image_url?: string
  cloudinary_public_id?: string
  description: string
  badge: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface InstagramPost {
  id: string
  image_url: string
  cloudinary_public_id?: string
  caption: string
  likes_count: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface SiteSettings {
  brand_name: string
  tagline: string
  hero_title: string
  hero_subtitle: string
  founder_name: string
  founder_title: string
  founder_image: string
  about_text: string
  instagram_handle: string
  whatsapp_number: string
  business_email: string
  business_address: string
  business_hours: string
  delivery_info: string
  return_policy: string
  featured_brands: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font_family: string
  services_enabled: boolean
  testimonials_enabled: boolean
  instagram_feed_enabled: boolean
  newsletter_enabled: boolean
  analytics_code: string
  meta_description: string
  meta_keywords: string
}

// Simple auth hook
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("minisLuxuryAuth")
        const sessionExpiry = localStorage.getItem("minisLuxuryAuthExpiry")

        if (storedUser && sessionExpiry) {
          const expiryTime = Number.parseInt(sessionExpiry)
          const currentTime = Date.now()

          if (currentTime < expiryTime) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("minisLuxuryAuth")
            localStorage.removeItem("minisLuxuryAuthExpiry")
            router.push("/admin/login")
          }
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem("minisLuxuryAuth")
    localStorage.removeItem("minisLuxuryAuthExpiry")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/admin/login")
  }

  return { isAuthenticated, isLoading, user, logout }
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // State for all data
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brand_name: "MINIS LUXURY",
    tagline: "Where Nigerian Street Fashion Meets Global Luxury",
    hero_title: "MINIS LUXURY",
    hero_subtitle: "Luxury is not a label — it's a lifestyle. Drip different.",
    founder_name: "Muhammed Umar Faruq",
    founder_title: "Founder & Creative Director",
    founder_image: "/placeholder.svg?height=600&width=500",
    about_text:
      "From the vibrant streets of Nigeria to the global luxury fashion scene, Muhammed Umar Faruq has built MINIS LUXURY into the premier destination for discerning fashion enthusiasts.",
    instagram_handle: "@MinisLuxury",
    whatsapp_number: "2349057244762",
    business_email: "hello@dripwithminis.com",
    business_address: "Victoria Island, Lagos, Nigeria",
    business_hours: "Mon-Sat: 10AM-8PM",
    delivery_info: "Free delivery within Lagos. Nationwide shipping available.",
    return_policy: "30-day return policy on all items.",
    featured_brands: "Chanel,Dior,Rick Owens,Jacquemus,Louis Vuitton,Off-White,Chrome Hearts",
    primary_color: "#d4af37",
    secondary_color: "#000000",
    accent_color: "#ffffff",
    font_family: "Inter",
    services_enabled: true,
    testimonials_enabled: true,
    instagram_feed_enabled: true,
    newsletter_enabled: true,
    analytics_code: "",
    meta_description: "Nigeria's premier luxury fashion and personal shopping service",
    meta_keywords: "luxury fashion, Nigerian fashion, personal shopping, streetwear, jewelry",
  })

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [editingInstagram, setEditingInstagram] = useState<InstagramPost | null>(null)

  // Form states
  const [productForm, setProductForm] = useState<Partial<Product>>({})
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({})
  const [instagramForm, setInstagramForm] = useState<Partial<InstagramPost>>({})

  // Load initial data
  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      loadInitialData()
    }
  }, [isAuthenticated])

  const loadInitialData = () => {
    // Load demo data
    const demoProducts: Product[] = [
      {
        id: "1",
        name: "Royal Street Hoodie",
        category: "Unisex Fashion",
        price: "₦45,000",
        image_url: "/IMG-20250618-WA0001.jpg",
        description: "Premium streetwear meets luxury comfort",
        badge: "Trending",
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Gold Chain Luxury Set",
        category: "Jewelry",
        price: "₦120,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "18k gold-plated statement piece",
        badge: "Limited",
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const demoTestimonials: Testimonial[] = [
      {
        id: "1",
        name: "Adunni Ade",
        role: "Nollywood Actress",
        content: "Minis Umar transformed my entire wardrobe. The attention to detail and luxury pieces are unmatched!",
        rating: 5,
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "David Adeleke",
        role: "Music Executive",
        content: "From red carpet events to casual street looks, MINIS LUXURY delivers excellence every time.",
        rating: 5,
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const demoInstagramPosts: InstagramPost[] = [
      {
        id: "1",
        image_url: "/placeholder.svg?height=300&width=300&text=Post1",
        caption: "New luxury drop! 🔥 #MinisLuxury #LuxuryFashion",
        likes_count: 245,
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        image_url: "/placeholder.svg?height=300&width=300&text=Post2",
        caption: "Street fashion meets luxury ✨ #StreetLuxury",
        likes_count: 189,
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    setProducts(demoProducts)
    setTestimonials(demoTestimonials)
    setInstagramPosts(demoInstagramPosts)
  }

  // Save all changes
  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would save to your database here
      localStorage.setItem("minisLuxury_products", JSON.stringify(products))
      localStorage.setItem("minisLuxury_testimonials", JSON.stringify(testimonials))
      localStorage.setItem("minisLuxury_instagram", JSON.stringify(instagramPosts))
      localStorage.setItem("minisLuxury_settings", JSON.stringify(siteSettings))

      setHasUnsavedChanges(false)
      toast({
        title: "Changes Saved!",
        description: "All your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Product Management Functions
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name || "",
      category: productForm.category || "",
      price: productForm.price || "",
      image_url: productForm.image_url || "/placeholder.svg?height=400&width=300",
      description: productForm.description || "",
      badge: productForm.badge || "New",
      is_active: true,
      sort_order: products.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setProducts([newProduct, ...products])
    setProductForm({})
    setIsProductModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm(product)
    setIsProductModalOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            ...productForm,
            updated_at: new Date().toISOString(),
          }
        : p,
    )

    setProducts(updatedProducts)
    setEditingProduct(null)
    setProductForm({})
    setIsProductModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Product Updated",
      description: "Product has been updated successfully.",
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    setHasUnsavedChanges(true)
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully.",
    })
  }

  const handleToggleProductStatus = (id: string) => {
    const updatedProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            is_active: !p.is_active,
            updated_at: new Date().toISOString(),
          }
        : p,
    )
    setProducts(updatedProducts)
    setHasUnsavedChanges(true)
  }

  // Testimonial Management Functions
  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: testimonialForm.name || "",
      role: testimonialForm.role || "",
      content: testimonialForm.content || "",
      rating: testimonialForm.rating || 5,
      is_active: true,
      sort_order: testimonials.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTestimonials([newTestimonial, ...testimonials])
    setTestimonialForm({})
    setIsTestimonialModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Testimonial Added",
      description: "New testimonial has been added successfully.",
    })
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setTestimonialForm(testimonial)
    setIsTestimonialModalOpen(true)
  }

  const handleUpdateTestimonial = () => {
    if (!editingTestimonial) return

    const updatedTestimonials = testimonials.map((t) =>
      t.id === editingTestimonial.id
        ? {
            ...t,
            ...testimonialForm,
            updated_at: new Date().toISOString(),
          }
        : t,
    )

    setTestimonials(updatedTestimonials)
    setEditingTestimonial(null)
    setTestimonialForm({})
    setIsTestimonialModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Testimonial Updated",
      description: "Testimonial has been updated successfully.",
    })
  }

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
    setHasUnsavedChanges(true)
    toast({
      title: "Testimonial Deleted",
      description: "Testimonial has been removed successfully.",
    })
  }

  const handleToggleTestimonialStatus = (id: string) => {
    const updatedTestimonials = testimonials.map((t) =>
      t.id === id
        ? {
            ...t,
            is_active: !t.is_active,
            updated_at: new Date().toISOString(),
          }
        : t,
    )
    setTestimonials(updatedTestimonials)
    setHasUnsavedChanges(true)
  }

  // Instagram Management Functions
  const handleAddInstagramPost = () => {
    const newPost: InstagramPost = {
      id: Date.now().toString(),
      image_url: instagramForm.image_url || "/placeholder.svg?height=300&width=300",
      caption: instagramForm.caption || "",
      likes_count: instagramForm.likes_count || 0,
      is_active: true,
      sort_order: instagramPosts.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setInstagramPosts([newPost, ...instagramPosts])
    setInstagramForm({})
    setIsInstagramModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Instagram Post Added",
      description: "New Instagram post has been added successfully.",
    })
  }

  const handleEditInstagramPost = (post: InstagramPost) => {
    setEditingInstagram(post)
    setInstagramForm(post)
    setIsInstagramModalOpen(true)
  }

  const handleUpdateInstagramPost = () => {
    if (!editingInstagram) return

    const updatedPosts = instagramPosts.map((p) =>
      p.id === editingInstagram.id
        ? {
            ...p,
            ...instagramForm,
            updated_at: new Date().toISOString(),
          }
        : p,
    )

    setInstagramPosts(updatedPosts)
    setEditingInstagram(null)
    setInstagramForm({})
    setIsInstagramModalOpen(false)
    setHasUnsavedChanges(true)
    toast({
      title: "Instagram Post Updated",
      description: "Instagram post has been updated successfully.",
    })
  }

  const handleDeleteInstagramPost = (id: string) => {
    setInstagramPosts(instagramPosts.filter((p) => p.id !== id))
    setHasUnsavedChanges(true)
    toast({
      title: "Instagram Post Deleted",
      description: "Instagram post has been removed successfully.",
    })
  }

  const handleToggleInstagramStatus = (id: string) => {
    const updatedPosts = instagramPosts.map((p) =>
      p.id === id
        ? {
            ...p,
            is_active: !p.is_active,
            updated_at: new Date().toISOString(),
          }
        : p,
    )
    setInstagramPosts(updatedPosts)
    setHasUnsavedChanges(true)
  }

  // Settings update function
  const handleSettingsChange = (key: keyof SiteSettings, value: any) => {
    setSiteSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasUnsavedChanges(true)
  }

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    })
  }

  const previewSite = () => {
    window.open("/", "_blank")
  }

  const exportData = () => {
    const data = {
      products,
      testimonials,
      instagramPosts,
      siteSettings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `minis-luxury-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "Your website data has been exported successfully.",
    })
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the useAuth hook will redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <AdminHeader
          title="MINIS LUXURY Admin"
          description="Complete website management dashboard"
          onSave={handleSaveAll}
          isSaving={isSaving}
        />

        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have unsaved changes. Don't forget to save your work!
              <Button onClick={handleSaveAll} size="sm" className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-black">
                Save Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{products.filter((p) => p.is_active).length} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Testimonials</p>
                      <p className="text-3xl font-bold text-gray-900">{testimonials.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{testimonials.filter((t) => t.is_active).length} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Instagram Posts</p>
                      <p className="text-3xl font-bold text-gray-900">{instagramPosts.length}</p>
                    </div>
                    <Instagram className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {instagramPosts.reduce((sum, post) => sum + post.likes_count, 0)} total likes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Website Status</p>
                      <p className="text-lg font-bold text-green-600">Live</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-400" />
                  </div>
                  <Button onClick={previewSite} size="sm" variant="outline" className="mt-2">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => {
                      setEditingProduct(null)
                      setProductForm({})
                      setIsProductModalOpen(true)
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingTestimonial(null)
                      setTestimonialForm({})
                      setIsTestimonialModalOpen(true)
                    }}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Review
                  </Button>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={previewSite} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Website updated successfully</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New product added</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New testimonial received</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingProduct(null)
                      setProductForm({})
                      setIsProductModalOpen(true)
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className={`${!product.is_active ? "opacity-50" : ""}`}>
                      <div className="relative">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-yellow-400 text-black">{product.badge}</Badge>
                        <div className="absolute top-2 right-2">
                          <Switch
                            checked={product.is_active}
                            onCheckedChange={() => handleToggleProductStatus(product.id)}
                          />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-lg font-bold text-yellow-600">{product.price}</p>
                        </div>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(product.name)}
                            className="text-blue-600"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Reviews & Testimonials</CardTitle>
                <Button
                  onClick={() => {
                    setEditingTestimonial(null)
                    setTestimonialForm({})
                    setIsTestimonialModalOpen(true)
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className={`${!testimonial.is_active ? "opacity-50" : ""}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <Switch
                                checked={testimonial.is_active}
                                onCheckedChange={() => handleToggleTestimonialStatus(testimonial.id)}
                              />
                            </div>
                            <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-gray-600">{testimonial.role}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditTestimonial(testimonial)}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(testimonial.content)}
                                  className="text-blue-600"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Instagram Feed Management</CardTitle>
                <Button
                  onClick={() => {
                    setEditingInstagram(null)
                    setInstagramForm({})
                    setIsInstagramModalOpen(true)
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {instagramPosts.map((post) => (
                    <Card key={post.id} className={`${!post.is_active ? "opacity-50" : ""}`}>
                      <div className="relative">
                        <Image
                          src={post.image_url || "/placeholder.svg"}
                          alt="Instagram post"
                          width={300}
                          height={300}
                          className="w-full aspect-square object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Switch
                            checked={post.is_active}
                            onCheckedChange={() => handleToggleInstagramStatus(post.id)}
                          />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          ❤️ {post.likes_count}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.caption}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditInstagramPost(post)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(post.caption)}
                            className="text-blue-600"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteInstagramPost(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <CloudinaryImageManager />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="founderName">Founder Name</Label>
                      <Input
                        id="founderName"
                        value={siteSettings.founder_name}
                        onChange={(e) => handleSettingsChange("founder_name", e.target.value)}
                        placeholder="Enter founder name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="founderTitle">Founder Title</Label>
                      <Input
                        id="founderTitle"
                        value={siteSettings.founder_title}
                        onChange={(e) => handleSettingsChange("founder_title", e.target.value)}
                        placeholder="Enter founder title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="founderImage">Founder Image URL</Label>
                      <Input
                        id="founderImage"
                        value={siteSettings.founder_image}
                        onChange={(e) => handleSettingsChange("founder_image", e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aboutText">About Text</Label>
                      <Textarea
                        id="aboutText"
                        value={siteSettings.about_text}
                        onChange={(e) => handleSettingsChange("about_text", e.target.value)}
                        placeholder="Enter about text"
                        rows={8}
                      />
                    </div>
                  </div>
                </div>
                {siteSettings.founder_image && (
                  <div className="mt-6">
                    <Label>Preview</Label>
                    <div className="mt-2 max-w-sm">
                      <Image
                        src={siteSettings.founder_image || "/placeholder.svg"}
                        alt="Founder preview"
                        width={300}
                        height={400}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design & Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        value={siteSettings.brand_name}
                        onChange={(e) => handleSettingsChange("brand_name", e.target.value)}
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={siteSettings.tagline}
                        onChange={(e) => handleSettingsChange("tagline", e.target.value)}
                        placeholder="Enter tagline"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={siteSettings.hero_title}
                        onChange={(e) => handleSettingsChange("hero_title", e.target.value)}
                        placeholder="Enter hero title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={siteSettings.hero_subtitle}
                        onChange={(e) => handleSettingsChange("hero_subtitle", e.target.value)}
                        placeholder="Enter hero subtitle"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={siteSettings.primary_color}
                          onChange={(e) => handleSettingsChange("primary_color", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={siteSettings.primary_color}
                          onChange={(e) => handleSettingsChange("primary_color", e.target.value)}
                          placeholder="#d4af37"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={siteSettings.secondary_color}
                          onChange={(e) => handleSettingsChange("secondary_color", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={siteSettings.secondary_color}
                          onChange={(e) => handleSettingsChange("secondary_color", e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select
                        value={siteSettings.font_family}
                        onValueChange={(value) => handleSettingsChange("font_family", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="featuredBrands">Featured Brands (comma-separated)</Label>
                      <Textarea
                        id="featuredBrands"
                        value={siteSettings.featured_brands}
                        onChange={(e) => handleSettingsChange("featured_brands", e.target.value)}
                        placeholder="Chanel,Dior,Rick Owens,Jacquemus"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 mt-3 text-gray-400" />
                      <Input
                        id="whatsappNumber"
                        value={siteSettings.whatsapp_number}
                        onChange={(e) => handleSettingsChange("whatsapp_number", e.target.value)}
                        placeholder="2349057244762"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <div className="flex gap-2">
                      <Mail className="h-4 w-4 mt-3 text-gray-400" />
                      <Input
                        id="businessEmail"
                        value={siteSettings.business_email}
                        onChange={(e) => handleSettingsChange("business_email", e.target.value)}
                        placeholder="hello@dripwithminis.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instagramHandle">Instagram Handle</Label>
                    <div className="flex gap-2">
                      <Instagram className="h-4 w-4 mt-3 text-gray-400" />
                      <Input
                        id="instagramHandle"
                        value={siteSettings.instagram_handle}
                        onChange={(e) => handleSettingsChange("instagram_handle", e.target.value)}
                        placeholder="@MinisLuxury"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 mt-3 text-gray-400" />
                      <Textarea
                        id="businessAddress"
                        value={siteSettings.business_address}
                        onChange={(e) => handleSettingsChange("business_address", e.target.value)}
                        placeholder="Victoria Island, Lagos, Nigeria"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="businessHours">Business Hours</Label>
                    <div className="flex gap-2">
                      <Clock className="h-4 w-4 mt-3 text-gray-400" />
                      <Input
                        id="businessHours"
                        value={siteSettings.business_hours}
                        onChange={(e) => handleSettingsChange("business_hours", e.target.value)}
                        placeholder="Mon-Sat: 10AM-8PM"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryInfo">Delivery Information</Label>
                    <Textarea
                      id="deliveryInfo"
                      value={siteSettings.delivery_info}
                      onChange={(e) => handleSettingsChange("delivery_info", e.target.value)}
                      placeholder="Free delivery within Lagos. Nationwide shipping available."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnPolicy">Return Policy</Label>
                    <Textarea
                      id="returnPolicy"
                      value={siteSettings.return_policy}
                      onChange={(e) => handleSettingsChange("return_policy", e.target.value)}
                      placeholder="30-day return policy on all items."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Feature Toggles</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="servicesEnabled">Personal Shopping Services</Label>
                        <Switch
                          id="servicesEnabled"
                          checked={siteSettings.services_enabled}
                          onCheckedChange={(checked) => handleSettingsChange("services_enabled", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testimonialsEnabled">Testimonials Section</Label>
                        <Switch
                          id="testimonialsEnabled"
                          checked={siteSettings.testimonials_enabled}
                          onCheckedChange={(checked) => handleSettingsChange("testimonials_enabled", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="instagramFeedEnabled">Instagram Feed</Label>
                        <Switch
                          id="instagramFeedEnabled"
                          checked={siteSettings.instagram_feed_enabled}
                          onCheckedChange={(checked) => handleSettingsChange("instagram_feed_enabled", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsletterEnabled">Newsletter Signup</Label>
                        <Switch
                          id="newsletterEnabled"
                          checked={siteSettings.newsletter_enabled}
                          onCheckedChange={(checked) => handleSettingsChange("newsletter_enabled", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={siteSettings.meta_description}
                      onChange={(e) => handleSettingsChange("meta_description", e.target.value)}
                      placeholder="Nigeria's premier luxury fashion and personal shopping service"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
                    <Textarea
                      id="metaKeywords"
                      value={siteSettings.meta_keywords}
                      onChange={(e) => handleSettingsChange("meta_keywords", e.target.value)}
                      placeholder="luxury fashion, Nigerian fashion, personal shopping"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="analyticsCode">Google Analytics Code</Label>
                    <Input
                      id="analyticsCode"
                      value={siteSettings.analytics_code}
                      onChange={(e) => handleSettingsChange("analytics_code", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={exportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This is a demo version. To save changes permanently, configure Supabase database integration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Modal */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productForm.name || ""}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="productCategory">Category</Label>
                  <Select
                    value={productForm.category || ""}
                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unisex Fashion">Unisex Fashion</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                      <SelectItem value="Bags">Bags</SelectItem>
                      <SelectItem value="Watches">Watches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productPrice">Price</Label>
                  <Input
                    id="productPrice"
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="₦45,000"
                  />
                </div>
                <div>
                  <Label htmlFor="productBadge">Badge</Label>
                  <Select
                    value={productForm.badge || ""}
                    onValueChange={(value) => setProductForm({ ...productForm, badge: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select badge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Drop">New Drop</SelectItem>
                      <SelectItem value="Trending">Trending</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Best Seller">Best Seller</SelectItem>
                      <SelectItem value="Exclusive">Exclusive</SelectItem>
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productImage">Image URL</Label>
                  <Input
                    id="productImage"
                    value={productForm.image_url || ""}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    placeholder="Enter image URL or upload"
                  />
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <div>
                  <Label htmlFor="productDescription">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={productForm.description || ""}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                {productForm.image_url && (
                  <div className="border rounded-lg p-2">
                    <Label>Preview</Label>
                    <Image
                      src={productForm.image_url || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Testimonial Modal */}
        <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testimonialName">Client Name</Label>
                  <Input
                    id="testimonialName"
                    value={testimonialForm.name || ""}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="testimonialRole">Role/Title</Label>
                  <Input
                    id="testimonialRole"
                    value={testimonialForm.role || ""}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    placeholder="e.g., Nollywood Actress"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="testimonialRating">Rating</Label>
                <Select
                  value={testimonialForm.rating?.toString() || "5"}
                  onValueChange={(value) => setTestimonialForm({ ...testimonialForm, rating: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="testimonialContent">Testimonial Content</Label>
                <Textarea
                  id="testimonialContent"
                  value={testimonialForm.content || ""}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  placeholder="Enter the testimonial content"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsTestimonialModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingTestimonial ? handleUpdateTestimonial : handleAddTestimonial}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Instagram Modal */}
        <Dialog open={isInstagramModalOpen} onOpenChange={setIsInstagramModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingInstagram ? "Edit Instagram Post" : "Add New Instagram Post"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instagramImage">Image URL</Label>
                <Input
                  id="instagramImage"
                  value={instagramForm.image_url || ""}
                  onChange={(e) => setInstagramForm({ ...instagramForm, image_url: e.target.value })}
                  placeholder="Enter image URL"
                />
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              <div>
                <Label htmlFor="instagramCaption">Caption</Label>
                <Textarea
                  id="instagramCaption"
                  value={instagramForm.caption || ""}
                  onChange={(e) => setInstagramForm({ ...instagramForm, caption: e.target.value })}
                  placeholder="Enter Instagram caption with hashtags"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="instagramLikes">Likes Count</Label>
                <Input
                  id="instagramLikes"
                  type="number"
                  value={instagramForm.likes_count || 0}
                  onChange={(e) =>
                    setInstagramForm({ ...instagramForm, likes_count: Number.parseInt(e.target.value) || 0 })
                  }
                  placeholder="Enter likes count"
                />
              </div>
              {instagramForm.image_url && (
                <div className="border rounded-lg p-2">
                  <Label>Preview</Label>
                  <Image
                    src={instagramForm.image_url || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover rounded mt-2"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsInstagramModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingInstagram ? handleUpdateInstagramPost : handleAddInstagramPost}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {editingInstagram ? "Update Post" : "Add Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
