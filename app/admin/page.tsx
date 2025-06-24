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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { getProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from "@/lib/api/products"
import { getTestimonials, createTestimonial } from "@/lib/api/testimonials"
import { getSiteSettings, setSiteSettings } from "@/lib/api/settings"
import { fallbackProducts, fallbackTestimonials, fallbackSiteSettings } from "@/lib/fallback-data"

// Types for our data structures
interface Product {
  id: string
  name: string
  category: string
  price: string
  image?: string
  image_url?: string
  description: string
  badge: string
  isActive: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  isActive: boolean
}

interface InstagramPost {
  id: number
  image: string
  caption: string
  likes: number
  isActive: boolean
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
  const [activeTab, setActiveTab] = useState("products")
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // State for all data
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [siteSettings, setSiteSettingsState] = useState<Record<string, string>>({})

  // Load data on component mount
  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])

  const loadAllData = async () => {
    setDataLoading(true)
    try {
      const [productsData, testimonialsData, settingsData] = await Promise.all([
        getProducts(),
        getTestimonials(),
        getSiteSettings(),
      ])

      setProducts(productsData)
      setTestimonials(testimonialsData)
      setSiteSettingsState(settingsData)
    } catch (error) {
      console.error("Error loading data:", error)
      // Use fallback data on error
      setProducts(fallbackProducts)
      setTestimonials(fallbackTestimonials)
      setSiteSettingsState(fallbackSiteSettings)

      toast({
        title: "Using Demo Data",
        description: "Configure Supabase to use real data management.",
      })
    } finally {
      setDataLoading(false)
    }
  }

  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=300",
      caption: "New luxury drop! 🔥",
      likes: 245,
      isActive: true,
    },
  ])

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

  const handleSaveData = async () => {
    setIsLoading(true)
    try {
      await setSiteSettings(siteSettings)
      toast({
        title: "Success!",
        description: "All changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Note",
        description: "Configure Supabase to save changes permanently.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct({
        name: productForm.name || "",
        category: productForm.category || "",
        price: productForm.price || "",
        image_url: productForm.image || null,
        description: productForm.description || "",
        badge: productForm.badge || "New",
      })

      setProducts([newProduct, ...products])
      setProductForm({})
      setIsProductModalOpen(false)
      toast({
        title: "Product Added",
        description: "New product has been added successfully.",
      })
    } catch (error) {
      // Add to local state for demo
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name || "",
        category: productForm.category || "",
        price: productForm.price || "",
        image_url: productForm.image || "/placeholder.svg?height=400&width=300",
        description: productForm.description || "",
        badge: productForm.badge || "New",
        isActive: true,
      }
      setProducts([newProduct, ...products])
      setProductForm({})
      setIsProductModalOpen(false)
      toast({
        title: "Product Added (Demo)",
        description: "Configure Supabase to save permanently.",
      })
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm(product)
    setIsProductModalOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const updatedProduct = await updateProduct(editingProduct.id, productForm)

      setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
      setEditingProduct(null)
      setProductForm({})
      setIsProductModalOpen(false)
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      })
    } catch (error) {
      // Update local state for demo
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm } : p)))
      setEditingProduct(null)
      setProductForm({})
      setIsProductModalOpen(false)
      toast({
        title: "Product Updated (Demo)",
        description: "Configure Supabase to save permanently.",
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully.",
      })
    } catch (error) {
      // Remove from local state for demo
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product Deleted (Demo)",
        description: "Configure Supabase to save permanently.",
      })
    }
  }

  const handleToggleProductStatus = async (id: string) => {
    try {
      const updatedProduct = await toggleProductStatus(id)
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)))
    } catch (error) {
      // Toggle local state for demo
      setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    }
  }

  // Similar handlers for testimonials
  const handleAddTestimonial = async () => {
    try {
      const newTestimonial = await createTestimonial({
        name: testimonialForm.name || "",
        role: testimonialForm.role || "",
        content: testimonialForm.content || "",
        rating: testimonialForm.rating || 5,
      })

      setTestimonials([newTestimonial, ...testimonials])
      setTestimonialForm({})
      setIsTestimonialModalOpen(false)
      toast({
        title: "Testimonial Added",
        description: "New testimonial has been added successfully.",
      })
    } catch (error) {
      // Add to local state for demo
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        name: testimonialForm.name || "",
        role: testimonialForm.role || "",
        content: testimonialForm.content || "",
        rating: testimonialForm.rating || 5,
        isActive: true,
      }
      setTestimonials([newTestimonial, ...testimonials])
      setTestimonialForm({})
      setIsTestimonialModalOpen(false)
      toast({
        title: "Testimonial Added (Demo)",
        description: "Configure Supabase to save permanently.",
      })
    }
  }

  const handleAddInstagramPost = () => {
    const newPost: InstagramPost = {
      id: Date.now(),
      image: instagramForm.image || "/placeholder.svg?height=300&width=300",
      caption: instagramForm.caption || "",
      likes: instagramForm.likes || 0,
      isActive: true,
    }
    setInstagramPosts([...instagramPosts, newPost])
    setInstagramForm({})
    setIsInstagramModalOpen(false)
    toast({
      title: "Instagram Post Added",
      description: "New Instagram post has been added successfully.",
    })
  }

  const handleToggleTestimonialStatus = (id: string) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    setTestimonials(updated)
  }

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
    toast({
      title: "Testimonial Deleted",
      description: "Testimonial has been removed successfully.",
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

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-gray-900">MINIS LUXURY Admin</h1>
              </div>
              <p className="text-gray-600">Manage your luxury fashion brand content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                <p className="text-sm text-gray-500">{user?.email || "admin@dripwithminis.com"}</p>
              </div>
              <Button
                onClick={handleSaveData}
                disabled={isLoading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Testimonials
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      onClick={() => {
                        setEditingProduct(null)
                        setProductForm({})
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={productForm.name || ""}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
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
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            value={productForm.price || ""}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            placeholder="₦45,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="badge">Badge</Label>
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
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={productForm.image || ""}
                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                            placeholder="Enter image URL"
                          />
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={productForm.description || ""}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Enter product description"
                            rows={4}
                          />
                        </div>
                        {productForm.image && (
                          <div className="border rounded-lg p-2">
                            <Label>Preview</Label>
                            <Image
                              src={productForm.image || "/placeholder.svg"}
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
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className={`${!product.isActive ? "opacity-50" : ""}`}>
                      <div className="relative">
                        <Image
                          src={product.image_url || product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-yellow-400 text-black">{product.badge}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <p className="text-lg font-bold text-yellow-600">{product.price}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={product.isActive}
                              onCheckedChange={() => handleToggleProductStatus(product.id)}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-3 w-3" />
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
                <CardTitle>Testimonial Management</CardTitle>
                <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      onClick={() => {
                        setEditingTestimonial(null)
                        setTestimonialForm({})
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          value={testimonialForm.name || ""}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                          placeholder="Enter client name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientRole">Role/Title</Label>
                        <Input
                          id="clientRole"
                          value={testimonialForm.role || ""}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                          placeholder="e.g., Nollywood Actress"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Select
                          value={testimonialForm.rating?.toString() || "5"}
                          onValueChange={(value) =>
                            setTestimonialForm({ ...testimonialForm, rating: Number.parseInt(value) })
                          }
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
                        <Label htmlFor="testimonialContent">Testimonial</Label>
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
                      <Button onClick={handleAddTestimonial} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                        Add Testimonial
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className={`${!testimonial.isActive ? "opacity-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <Switch
                                checked={testimonial.isActive}
                                onCheckedChange={() => handleToggleTestimonialStatus(testimonial.id)}
                              />
                            </div>
                            <p className="text-gray-700 mb-3 italic">"{testimonial.content}"</p>
                            <div>
                              <p className="font-semibold">{testimonial.name}</p>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would go here - Instagram, Images, About, Settings */}
          <TabsContent value="instagram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Instagram feed management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Image management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">About section management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Site settings management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
