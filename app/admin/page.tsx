"use client"

import { useState } from "react"
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
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { CloudinaryImageManager } from "@/components/admin/cloudinary-image-manager"

// Types for our data structures
interface Product {
  id: number
  name: string
  category: string
  price: string
  image: string
  description: string
  badge: string
  isActive: boolean
}

interface Testimonial {
  id: number
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

interface SiteSettings {
  brandName: string
  tagline: string
  whatsappNumber: string
  instagramHandle: string
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  founderName: string
  founderTitle: string
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("products")
  const [isLoading, setIsLoading] = useState(false)

  // State for all data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Royal Street Hoodie",
      category: "Unisex Fashion",
      price: "₦45,000",
      image: "/placeholder.svg?height=400&width=300",
      description: "Premium streetwear meets luxury comfort",
      badge: "Trending",
      isActive: true,
    },
    {
      id: 2,
      name: "Gold Chain Luxury Set",
      category: "Jewelry",
      price: "₦120,000",
      image: "/placeholder.svg?height=400&width=300",
      description: "18k gold-plated statement piece",
      badge: "Limited",
      isActive: true,
    },
  ])

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Adunni Ade",
      role: "Nollywood Actress",
      content: "Minis Umar transformed my entire wardrobe. The attention to detail and luxury pieces are unmatched!",
      rating: 5,
      isActive: true,
    },
  ])

  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=300",
      caption: "New luxury drop! 🔥",
      likes: 245,
      isActive: true,
    },
  ])

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brandName: "MINIS LUXURY",
    tagline: "Where Nigerian Street Fashion Meets Global Luxury",
    whatsappNumber: "2349057244762",
    instagramHandle: "@Minis_Luxury",
    heroTitle: "MINIS LUXURY",
    heroSubtitle: "Where Nigerian Street Fashion Meets Global Luxury",
    aboutText: "From the vibrant streets of Nigeria to the global luxury fashion scene...",
    founderName: "Muhammed Umar Faruq",
    founderTitle: "Founder & Creative Director",
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

  const handleSaveData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would save to your database/CMS
      localStorage.setItem(
        "minisLuxuryData",
        JSON.stringify({
          products,
          testimonials,
          instagramPosts,
          siteSettings,
        }),
      )

      toast({
        title: "Success!",
        description: "All changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: productForm.name || "",
      category: productForm.category || "",
      price: productForm.price || "",
      image: productForm.image || "/placeholder.svg?height=400&width=300",
      description: productForm.description || "",
      badge: productForm.badge || "New",
      isActive: true,
    }
    setProducts([...products, newProduct])
    setProductForm({})
    setIsProductModalOpen(false)
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
    toast({
      title: "Product Updated",
      description: "Product has been updated successfully.",
    })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully.",
    })
  }

  const handleToggleProductStatus = (id: number) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    setProducts(updatedProducts)
  }

  // Similar handlers for testimonials and Instagram posts
  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: testimonialForm.name || "",
      role: testimonialForm.role || "",
      content: testimonialForm.content || "",
      rating: testimonialForm.rating || 5,
      isActive: true,
    }
    setTestimonials([...testimonials, newTestimonial])
    setTestimonialForm({})
    setIsTestimonialModalOpen(false)
    toast({
      title: "Testimonial Added",
      description: "New testimonial has been added successfully.",
    })
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <AdminHeader
              title="MINIS LUXURY Admin"
              description="Manage your luxury fashion brand content"
              onSave={handleSaveData}
              isSaving={isLoading}
            />
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
                            src={product.image || "/placeholder.svg"}
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
                                  onCheckedChange={() => {
                                    const updated = testimonials.map((t) =>
                                      t.id === testimonial.id ? { ...t, isActive: !t.isActive } : t,
                                    )
                                    setTestimonials(updated)
                                  }}
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
                                onClick={() => setTestimonials(testimonials.filter((t) => t.id !== testimonial.id))}
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

            {/* Instagram Tab */}
            <TabsContent value="instagram" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Instagram Feed Management</CardTitle>
                  <Dialog open={isInstagramModalOpen} onOpenChange={setIsInstagramModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        onClick={() => {
                          setEditingInstagram(null)
                          setInstagramForm({})
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Instagram Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="postImage">Image URL</Label>
                          <Input
                            id="postImage"
                            value={instagramForm.image || ""}
                            onChange={(e) => setInstagramForm({ ...instagramForm, image: e.target.value })}
                            placeholder="Enter image URL"
                          />
                          <Button variant="outline" size="sm" className="mt-2 w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                        <div>
                          <Label htmlFor="caption">Caption</Label>
                          <Textarea
                            id="caption"
                            value={instagramForm.caption || ""}
                            onChange={(e) => setInstagramForm({ ...instagramForm, caption: e.target.value })}
                            placeholder="Enter post caption"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="likes">Likes Count</Label>
                          <Input
                            id="likes"
                            type="number"
                            value={instagramForm.likes || 0}
                            onChange={(e) =>
                              setInstagramForm({ ...instagramForm, likes: Number.parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                          />
                        </div>
                        {instagramForm.image && (
                          <div className="border rounded-lg p-2">
                            <Label>Preview</Label>
                            <Image
                              src={instagramForm.image || "/placeholder.svg"}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="w-full h-48 object-cover rounded mt-2"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsInstagramModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddInstagramPost}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        >
                          Add Post
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {instagramPosts.map((post) => (
                      <Card key={post.id} className={`${!post.isActive ? "opacity-50" : ""}`}>
                        <div className="relative">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Instagram post"
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Switch
                              checked={post.isActive}
                              onCheckedChange={() => {
                                const updated = instagramPosts.map((p) =>
                                  p.id === post.id ? { ...p, isActive: !p.isActive } : p,
                                )
                                setInstagramPosts(updated)
                              }}
                            />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                          <p className="text-xs text-gray-500">{post.likes} likes</p>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setInstagramPosts(instagramPosts.filter((p) => p.id !== post.id))}
                              className="text-red-600 hover:text-red-700 flex-1"
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
                          value={siteSettings.founderName}
                          onChange={(e) => setSiteSettings({ ...siteSettings, founderName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="founderTitle">Founder Title</Label>
                        <Input
                          id="founderTitle"
                          value={siteSettings.founderTitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, founderTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="aboutText">About Text</Label>
                        <Textarea
                          id="aboutText"
                          value={siteSettings.aboutText}
                          onChange={(e) => setSiteSettings({ ...siteSettings, aboutText: e.target.value })}
                          rows={8}
                          placeholder="Enter the about section content..."
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Founder Photo</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Upload founder photo</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Preview</h4>
                        <div className="text-sm space-y-2">
                          <p>
                            <strong>Name:</strong> {siteSettings.founderName}
                          </p>
                          <p>
                            <strong>Title:</strong> {siteSettings.founderTitle}
                          </p>
                          <p>
                            <strong>About:</strong> {siteSettings.aboutText.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
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
                          value={siteSettings.brandName}
                          onChange={(e) => setSiteSettings({ ...siteSettings, brandName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={siteSettings.tagline}
                          onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input
                          id="heroTitle"
                          value={siteSettings.heroTitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                        <Input
                          id="heroSubtitle"
                          value={siteSettings.heroSubtitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input
                          id="whatsappNumber"
                          value={siteSettings.whatsappNumber}
                          onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                          placeholder="2349057244762"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagramHandle">Instagram Handle</Label>
                        <Input
                          id="instagramHandle"
                          value={siteSettings.instagramHandle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, instagramHandle: e.target.value })}
                          placeholder="@Minis_Luxury"
                        />
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Upload className="h-4 w-4 mr-2" />
                            Backup All Data
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
