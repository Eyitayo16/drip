"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "./image-upload"
import { Search, Grid, List, Download, Share2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface CloudinaryImage {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
  tags: string[]
  folder: string
}

export function CloudinaryImageManager() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for demonstration
  useEffect(() => {
    const mockImages: CloudinaryImage[] = [
      {
        public_id: "minis-luxury/products/hoodie-1",
        secure_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250618-WA0001.jpg-PzKHN0Z5yD1OT00JM5ycIs4l4DFo3e.jpeg",
        width: 800,
        height: 800,
        format: "jpg",
        bytes: 245760,
        created_at: "2024-01-15T10:30:00Z",
        tags: ["product", "hoodie", "streetwear"],
        folder: "products",
      },
      {
        public_id: "minis-luxury/founder/umar-portrait",
        secure_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image_fx%20%283%29.jpg-GYnZUXL5qMoaadF2HbLnOsyTaUQL13.png",
        width: 1200,
        height: 800,
        format: "png",
        bytes: 567890,
        created_at: "2024-01-10T14:20:00Z",
        tags: ["founder", "portrait", "about"],
        folder: "founder",
      },
    ]
    setImages(mockImages)
    setFilteredImages(mockImages)
  }, [])

  useEffect(() => {
    let filtered = images

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by folder
    if (selectedFolder !== "all") {
      filtered = filtered.filter((img) => img.folder === selectedFolder)
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, selectedFolder])

  const handleImageUploaded = (newImage: any) => {
    const cloudinaryImage: CloudinaryImage = {
      ...newImage,
      tags: ["minis-luxury"],
      folder: "products",
    }
    setImages((prev) => [cloudinaryImage, ...prev])
  }

  const handleImageRemoved = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId))
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copied!",
      description: "Image URL has been copied to clipboard.",
    })
  }

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const folders = ["all", ...Array.from(new Set(images.map((img) => img.folder)))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-2">
              <Grid className="h-5 w-5 text-black" />
            </div>
            Cloudinary Image Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="manage">Manage Images</TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    onImageRemoved={handleImageRemoved}
                    maxFiles={10}
                    folder="minis-luxury/products"
                    tags={["product", "minis-luxury"]}
                  />
                </div>
                <div className="space-y-4">
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Upload Guidelines</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Use high-quality images (min 800px)</li>
                        <li>• JPEG/PNG/WebP formats only</li>
                        <li>• Max 10MB per image</li>
                        <li>• Use descriptive filenames</li>
                        <li>• Images auto-optimized by Cloudinary</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Cloudinary Features</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Automatic optimization</li>
                        <li>• Responsive image delivery</li>
                        <li>• Global CDN distribution</li>
                        <li>• Real-time transformations</li>
                        <li>• Advanced analytics</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Manage Tab */}
            <TabsContent value="manage" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder === "all" ? "All Folders" : folder}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Images Display */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredImages.map((image) => (
                    <Card key={image.public_id} className="overflow-hidden group">
                      <div className="relative aspect-square">
                        <Image
                          src={image.secure_url || "/placeholder.svg"}
                          alt={image.public_id}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => copyImageUrl(image.secure_url)}>
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(image.secure_url, image.public_id)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <p className="text-xs font-medium truncate">{image.public_id.split("/").pop()}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {image.width}×{image.height}
                            </span>
                            <span>{formatFileSize(image.bytes)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {image.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredImages.map((image) => (
                    <Card key={image.public_id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={image.secure_url || "/placeholder.svg"}
                              alt={image.public_id}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{image.public_id}</p>
                            <p className="text-sm text-gray-500">
                              {image.width}×{image.height} • {formatFileSize(image.bytes)} •{" "}
                              {image.format.toUpperCase()}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {image.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => copyImageUrl(image.secure_url)}>
                              <Share2 className="h-3 w-3 mr-1" />
                              Copy URL
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadImage(image.secure_url, image.public_id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredImages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Grid className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No images found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or upload some images</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
