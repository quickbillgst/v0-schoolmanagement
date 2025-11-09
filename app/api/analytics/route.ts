import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Request from "@/models/Request"
import Equipment from "@/models/Equipment"
import User from "@/models/User"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// GET analytics data
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

    // Only admins can access full analytics
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Only admins can view analytics" }, { status: 403 })
    }

    // Get overall statistics
    const totalEquipment = await Equipment.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalRequests = await Request.countDocuments()
    const approvedRequests = await Request.countDocuments({ status: "approved" })
    const pendingRequests = await Request.countDocuments({ status: "pending" })
    const rejectedRequests = await Request.countDocuments({ status: "rejected" })
    const returnedRequests = await Request.countDocuments({ status: "returned" })

    // Get overdue items
    const now = new Date()
    const overdueItems = await Request.countDocuments({
      status: "approved",
      dueDate: { $lt: now },
    })

    // Get items under maintenance
    const maintenanceItems = await Equipment.countDocuments({ status: "maintenance" })

    // Category-wise equipment usage
    const categoryUsage = await Request.aggregate([
      { $match: { status: { $in: ["approved", "returned"] } } },
      { $group: { _id: "$equipmentId", count: { $sum: 1 } } },
      { $lookup: { from: "equipments", localField: "_id", foreignField: "_id", as: "equipment" } },
      { $unwind: "$equipment" },
      { $group: { _id: "$equipment.category", count: { $sum: "$count" } } },
      { $sort: { count: -1 } },
    ])

    // Most borrowed items
    const frequentlyBorrowed = await Request.aggregate([
      { $match: { status: { $in: ["approved", "returned"] } } },
      { $group: { _id: "$equipmentId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "equipments", localField: "_id", foreignField: "_id", as: "equipment" } },
      { $unwind: "$equipment" },
      { $project: { name: "$equipment.name", count: 1 } },
    ])

    // Monthly borrow trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrend = await Request.aggregate([
      { $match: { requestDate: { $gte: sixMonthsAgo }, status: { $in: ["approved", "returned"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$requestDate" },
            month: { $month: "$requestDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: {
            $dateToString: {
              format: "%B",
              date: new Date("2024-01-01"),
            },
          },
          count: 1,
        },
      },
    ])

    // User role distribution
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Overdue percentage
    const overduePercentage = totalRequests > 0 ? Math.round((overdueItems / approvedRequests) * 100) : 0

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalEquipment,
          totalUsers,
          totalRequests,
          approvedRequests,
          pendingRequests,
          rejectedRequests,
          returnedRequests,
          overdueItems,
          maintenanceItems,
          overduePercentage,
        },
        charts: {
          categoryUsage,
          frequentlyBorrowed,
          monthlyTrend,
          usersByRole,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
