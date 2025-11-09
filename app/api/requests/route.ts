import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Request from "@/models/Request"
import Equipment from "@/models/Equipment"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// GET requests
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

    const {
      status,
      userId,
      equipmentId,
      page = 1,
      limit = 10,
      sortBy = "requestDate",
      sortOrder = "desc",
    } = Object.fromEntries(request.nextUrl.searchParams)

    const query: any = {}

    // Role-based filtering
    if (decoded.role === "student") {
      query.requesterId = decoded.id
    } else if (userId && (decoded.role === "admin" || decoded.role === "staff")) {
      query.requesterId = userId
    }

    if (status) {
      query.status = status
    }

    if (equipmentId) {
      query.equipmentId = equipmentId
    }

    const pageNum = Number.parseInt(page as string) || 1
    const limitNum = Number.parseInt(limit as string) || 10
    const skip = (pageNum - 1) * limitNum

    const sortField = ["requestDate", "dueDate", "createdAt"].includes(sortBy as string)
      ? (sortBy as string)
      : "requestDate"
    const sortDirection = sortOrder === "asc" ? 1 : -1

    const total = await Request.countDocuments(query)
    const requests = await Request.find(query)
      .populate("requesterId", "name email")
      .populate("equipmentId", "name category quantity availableQuantity")
      .populate("approvedBy", "name email")
      .skip(skip)
      .limit(limitNum)
      .sort({ [sortField]: sortDirection })

    // Add computed fields
    const enrichedRequests = requests.map((req: any) => ({
      ...req.toObject(),
      isOverdue: new Date(req.dueDate) < new Date() && req.status === "approved",
      daysUntilDue: Math.ceil((new Date(req.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    }))

    return NextResponse.json(
      {
        success: true,
        requests: enrichedRequests,
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

// POST - Create new borrowing request
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

    if (!["student", "staff"].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: "Only students and staff can make requests" },
        { status: 403 },
      )
    }

    const { equipmentId, quantity = 1, dueDate } = await request.json()

    if (!equipmentId || !dueDate) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    const equipment = await Equipment.findById(equipmentId)
    if (!equipment) {
      return NextResponse.json({ success: false, message: "Equipment not found" }, { status: 404 })
    }

    if (equipment.availableQuantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${equipment.availableQuantity} items available`,
        },
        { status: 400 },
      )
    }

    const borrowRequest = await Request.create({
      requesterId: decoded.id,
      equipmentId,
      quantity,
      dueDate,
      status: "pending",
    })

    return NextResponse.json(borrowRequest, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
