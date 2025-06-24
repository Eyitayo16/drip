import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "minis-luxury"
    const tags = JSON.parse((formData.get("tags") as string) || "[]")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, {
      folder,
      tags,
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
