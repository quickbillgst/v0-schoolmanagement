import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Notification from "@/models/Notification"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    await dbConnect()

    const notifications = await Notification.find({ userId: decoded.userId })
      .populate("requestId")
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({
      userId: decoded.userId,
      isRead: false,
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching notifications:", error.message)
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { notificationId, isRead } = await request.json()

    await dbConnect()

    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead }, { new: true })

    return NextResponse.json(notification)
  } catch (error: any) {
    console.error("[v0] Error updating notification:", error.message)
    return NextResponse.json({ message: "Failed to update notification" }, { status: 500 })
  }
}
