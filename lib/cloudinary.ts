import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

export interface UploadOptions {
  folder?: string
  transformation?: any[]
  tags?: string[]
  context?: Record<string, string>
}

// Upload image to Cloudinary
export async function uploadToCloudinary(
  file: File | string,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult> {
  try {
    const { folder = "minis-luxury", transformation = [], tags = [], context = {} } = options

    let uploadData: string

    if (typeof file === "string") {
      uploadData = file
    } else {
      // Convert File to base64
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      uploadData = `data:${file.type};base64,${base64}`
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      transformation,
      tags: ["minis-luxury", ...tags],
      context,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Failed to upload image to Cloudinary")
  }
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return false
  }
}

// Get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  } = {},
): string {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options

  let transformation = `q_${quality},f_${format}`

  if (width || height) {
    transformation += `,c_${crop}`
    if (width) transformation += `,w_${width}`
    if (height) transformation += `,h_${height}`
  }

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

// Generate image variants for responsive design
export function generateImageVariants(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150 }),
    small: getOptimizedImageUrl(publicId, { width: 300, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { width: 600, height: 600 }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
    original: getOptimizedImageUrl(publicId),
  }
}

export default cloudinary
