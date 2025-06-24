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
  Star,
  Instagram,
  Settings,
  ShoppingBag,
  MessageSquare,
  Crown,
  Eye,
  Copy,
  Download,
  AlertTriangle,
  Globe,
  Layout,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Simplified types
interface Product {
  id: string
  name: string
  category: string
  price: string
  image_url?: string
  description: string
  badge: string
  is_active: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  is_active: boolean
}

interface InstagramPost {
  id: string
  image_url: string
  caption: string
  likes_count: number
  is_active: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([])

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // Form states
  const [productForm, setProductForm] = useState<Partial<Product>>({})
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({})

  // Site settings
  const [siteSettings, setSiteSettings] = useState({
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
    primary_color: "#d4af37",
    secondary_color: "#000000",
  })

  // Check authentication on mount
  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("minisLuxuryAuth")
        const sessionExpiry = localStorage.getItem("minisLuxuryAuthExpiry")

        if (storedUser && sessionExpiry) {
          const expiryTime = Number.parseInt(sessionExpiry)
          const currentTime = Date.now()

          if (currentTime < expiryTime) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
            loadInitialData()
          } else {
            localStorage.removeItem("minisLuxuryAuth")
            localStorage.removeItem("minisLuxuryAuthExpiry")
            router.push("/admin/login")
          }
        } else {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }

  const loadInitialData = () => {
    // Load demo data
    const demoProducts: Product[] = [
      {
        id: "1",
        name: "Royal Street Hoodie",
        category: "Unisex Fashion",
        price: "₦45,000",
        image_url: "/placeholder.svg?height=400&width=300",
        description: "Premium streetwear meets luxury comfort",
        badge: "Trending",
        is_active: true,
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
      },
      {
        id: "2",
        name: "David Adeleke",
        role: "Music Executive",
        content: "From red carpet events to casual street looks, MINIS LUXURY delivers excellence every time.",
        rating: 5,
        is_active: true,
      },
    ]

    const demoInstagramPosts: InstagramPost[] = [
      {
        id: "1",
        image_url: "/placeholder.svg?height=300&width=300",
        caption: "New luxury drop! 🔥 #MinisLuxury #LuxuryFashion",
        likes_count: 245,
        is_active: true,
      },
      {
        id: "2",
        image_url: "/placeholder.svg?height=300&width=300",
        caption: "Street fashion meets luxury ✨ #StreetLuxury",
        likes_count: 189,
        is_active: true,
      },
    ]

    setProducts(demoProducts)
    setTestimonials(demoTestimonials)
    setInstagramPosts(demoInstagramPosts)
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("minisLuxuryAuth")
      localStorage.removeItem("minisLuxuryAuthExpiry")
    }
    setIsAuthenticated(false)
    setUser(null)
    router.push("/admin/login")
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (typeof window !== "undefined") {
        localStorage.setItem("minisLuxury_products", JSON.stringify(products))
        localStorage.setItem("minisLuxury_testimonials", JSON.stringify(testimonials))
        localStorage.setItem("minisLuxury_instagram", JSON.stringify(instagramPosts))
        localStorage.setItem("minisLuxury_settings", JSON.stringify(siteSettings))
      }

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

  // Product functions
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

    const updatedProducts = products.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm } : p))

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
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    setProducts(updatedProducts)
    setHasUnsavedChanges(true)
  }

  // Testimonial functions
  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: testimonialForm.name || "",
      role: testimonialForm.role || "",
      content: testimonialForm.content || "",
      rating: testimonialForm.rating || 5,
      is_active: true,
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
      t.id === editingTestimonial.id ? { ...t, ...testimonialForm } : t,
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
    const updatedTestimonials = testimonials.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
    setTestimonials(updatedTestimonials)
    setHasUnsavedChanges(true)
  }

  // Utility functions
  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Text has been copied to clipboard.",
      })
    }
  }

  const previewSite = () => {
    if (typeof window !== "undefined") {
      window.open("/", "_blank")
    }
  }

  const exportData = () => {
    const data = {
      products,
      testimonials,
      instagramPosts,
      siteSettings,
      exportDate: new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
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
  }

  // Don't render until mounted
  if (!mounted) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-gray-900">MINIS LUXURY Admin</h1>
              </div>
              <p className="text-gray-600">Complete website management dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                <p className="text-sm text-gray-500">{user?.email || "admin@dripwithminis.com"}</p>
              </div>
              <Button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

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
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow-sm">
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
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        value={siteSettings.brand_name}
                        onChange={(e) => setSiteSettings({ ...siteSettings, brand_name: e.target.value })}
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={siteSettings.tagline}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                        placeholder="Enter tagline"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <Input
                        id="whatsappNumber"
                        value={siteSettings.whatsapp_number}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp_number: e.target.value })}
                        placeholder="2349057244762"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        value={siteSettings.business_email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, business_email: e.target.value })}
                        placeholder="hello@dripwithminis.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instagramHandle">Instagram Handle</Label>
                      <Input
                        id="instagramHandle"
                        value={siteSettings.instagram_handle}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram_handle: e.target.value })}
                        placeholder="@MinisLuxury"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Textarea
                        id="businessAddress"
                        value={siteSettings.business_address}
                        onChange={(e) => setSiteSettings({ ...siteSettings, business_address: e.target.value })}
                        placeholder="Victoria Island, Lagos, Nigeria"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessHours">Business Hours</Label>
                      <Input
                        id="businessHours"
                        value={siteSettings.business_hours}
                        onChange={(e) => setSiteSettings({ ...siteSettings, business_hours: e.target.value })}
                        placeholder="Mon-Sat: 10AM-8PM"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Modal */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="productImage">Image URL</Label>
                <Input
                  id="productImage"
                  value={productForm.image_url || ""}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={productForm.description || ""}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
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
      </div>
    </div>
  )
}
