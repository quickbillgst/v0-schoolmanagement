import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Equipment from "@/models/Equipment"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// GET all equipment with enhanced filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const {
      search,
      category,
      condition,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = Object.fromEntries(request.nextUrl.searchParams)

    const query: any = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (category) {
      query.category = category
    }

    if (condition) {
      query.condition = condition
    }

    const pageNum = Number.parseInt(page as string) || 1
    const limitNum = Number.parseInt(limit as string) || 10
    const skip = (pageNum - 1) * limitNum

    const sortField = ["name", "quantity", "category", "condition", "createdAt"].includes(sortBy as string)
      ? (sortBy as string)
      : "name"
    const sortDirection = sortOrder === "desc" ? -1 : 1

    const total = await Equipment.countDocuments(query)
    const equipment = await Equipment.find(query)
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limitNum)
      .sort({ [sortField]: sortDirection })

    return NextResponse.json(
      {
        success: true,
        equipment,
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

// POST new equipment (admin only)
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ success: false, message: "Only admins can add equipment" }, { status: 403 })
    }

    const { name, category, condition, quantity, description } = await request.json()

    if (!name || !category || !quantity) {
      return NextResponse.json({ success: false, message: "Please provide required fields" }, { status: 400 })
    }

    const equipment = await Equipment.create({
      name,
      category,
      condition: condition || "good",
      quantity,
      availableQuantity: quantity,
      description,
      createdBy: decoded.id,
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
