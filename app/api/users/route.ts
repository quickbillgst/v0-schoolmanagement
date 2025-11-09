import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// GET all users (admin only)
export async function GET(request: NextRequest) {
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
      return NextResponse.json({ success: false, message: "Only admins can view all users" }, { status: 403 })
    }

    const { search, role, page = 1, limit = 10 } = Object.fromEntries(request.nextUrl.searchParams)

    const query: any = {}
    if (role) {
      query.role = role
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const pageNum = Number.parseInt(page as string) || 1
    const limitNum = Number.parseInt(limit as string) || 10
    const skip = (pageNum - 1) * limitNum

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .select("_id name email role createdAt")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        users,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
