import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Request from "@/models/Request"
import Equipment from "@/models/Equipment"
import User from "@/models/User"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

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
      return NextResponse.json({ success: false, message: "Only admins can export analytics" }, { status: 403 })
    }

    const format = request.nextUrl.searchParams.get("format") || "json"

    // Get all necessary data
    const [requests, equipment, users] = await Promise.all([
      Request.find()
        .populate("requesterId", "name email role")
        .populate("equipmentId", "name category quantity")
        .lean(),
      Equipment.find().populate("createdBy", "name email").lean(),
      User.find().select("_id name email role createdAt").lean(),
    ])

    if (format === "csv") {
      // Export requests as CSV
      const csvContent = [
        [
          "Request ID",
          "Requester Name",
          "Requester Email",
          "Equipment",
          "Category",
          "Quantity",
          "Status",
          "Request Date",
          "Due Date",
          "Return Date",
        ],
        ...requests.map((req: any) => [
          req._id,
          req.requesterId?.name || "N/A",
          req.requesterId?.email || "N/A",
          req.equipmentId?.name || "N/A",
          req.equipmentId?.category || "N/A",
          req.quantity || 1,
          req.status,
          new Date(req.requestDate).toLocaleDateString(),
          new Date(req.dueDate).toLocaleDateString(),
          req.returnDate ? new Date(req.returnDate).toLocaleDateString() : "Not returned",
        ]),
      ]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="requests-export.csv"',
        },
      })
    }

    // JSON format
    return NextResponse.json(
      {
        success: true,
        exportData: {
          requests,
          equipment,
          users,
          exportDate: new Date().toISOString(),
          totalRequests: requests.length,
          totalEquipment: equipment.length,
          totalUsers: users.length,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
