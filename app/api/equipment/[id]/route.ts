import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Equipment from "@/models/Equipment"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// PUT - Update equipment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Verify authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can update equipment" }, { status: 403 })
    }

    const { name, category, condition, quantity, description } = await request.json()

    const equipment = await Equipment.findByIdAndUpdate(
      params.id,
      { name, category, condition, quantity, description },
      { new: true, runValidators: true },
    )

    if (!equipment) {
      return NextResponse.json({ success: false, message: "Equipment not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Equipment updated successfully",
        data: equipment,
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE equipment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Verify authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can delete equipment" }, { status: 403 })
    }

    const equipment = await Equipment.findByIdAndDelete(params.id)

    if (!equipment) {
      return NextResponse.json({ success: false, message: "Equipment not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Equipment deleted successfully",
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
