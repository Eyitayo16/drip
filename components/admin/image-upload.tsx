"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon, Loader2, AlertTriangle, Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface UploadedImage {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
}

interface ImageUploadProps {
  onImageUploaded: (image: UploadedImage) => void
  onImageRemoved?: (publicId: string) => void
  existingImages?: UploadedImage[]
  maxFiles?: number
  acceptedTypes?: string[]
  folder?: string
  tags?: string[]
  className?: string
}

export function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  existingImages = [],
  maxFiles = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  folder = "minis-luxury",
  tags = [],
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(existingImages)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format.`,
          variant: "destructive",
        })
        return false
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB.`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    if (uploadedImages.length + validFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} images.`,
        variant: "destructive",
      })
      return
    }

    validFiles.forEach(uploadFile)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("tags", JSON.stringify(tags))

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result: UploadedImage = await response.json()

      setUploadedImages((prev) => [...prev, result])
      onImageUploaded(result)

      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded to Cloudinary.`,
      })
    } catch (error) {
      setError("Failed to upload image. Please try again.")
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = async (image: UploadedImage) => {
    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: image.public_id }),
      })

      if (response.ok) {
        setUploadedImages((prev) => prev.filter((img) => img.public_id !== image.public_id))
        onImageRemoved?.(image.public_id)

        toast({
          title: "Image removed",
          description: "Image has been deleted from Cloudinary.",
        })
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete image.",
        variant: "destructive",
      })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-yellow-400 bg-yellow-50" : "border-gray-300"
        }`}
      >
        <CardContent
          className="p-6"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {uploading ? (
                <Loader2 className="h-12 w-12 text-yellow-400 animate-spin" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
            </div>

            {uploading ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading to Cloudinary...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-700 mb-2">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">Supports JPEG, PNG, WebP up to 10MB each</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  disabled={uploadedImages.length >= maxFiles}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Images
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  {uploadedImages.length} / {maxFiles} images uploaded
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <Card key={image.public_id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={image.secure_url || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={() => window.open(image.secure_url, "_blank")}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveImage(image)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {image.format.toUpperCase()}
                    </Badge>
                    <span>{formatFileSize(image.bytes)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
