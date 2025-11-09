import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// GET user by ID (admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can view user details" }, { status: 403 })
    }

    const user = await User.findById(params.id).select("_id name email role createdAt")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can update users" }, { status: 403 })
    }

    const { name, role } = await request.json()

    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    if (name) user.name = name
    if (role && ["student", "staff", "admin"].includes(role)) {
      user.role = role
    }

    await user.save()

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can delete users" }, { status: 403 })
    }

    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Prevent deletion of active admin accounts
    if (user.role === "admin" && user._id.toString() !== decoded.id) {
      return NextResponse.json({ success: false, message: "Cannot delete active admin accounts" }, { status: 403 })
    }

    await User.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true, message: "User deactivated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
