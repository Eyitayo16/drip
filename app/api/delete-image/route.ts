import { type NextRequest, NextResponse } from "next/server"
import { deleteFromCloudinary } from "@/lib/cloudinary"

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 })
    }

    const success = await deleteFromCloudinary(publicId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
