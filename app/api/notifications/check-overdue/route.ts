import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Request from "@/models/Request"
import Notification from "@/models/Notification"

export async function POST(request: NextRequest) {
  try {
    // Simple authentication for cron jobs - in production use a more secure method
    const authHeader = request.headers.get("Authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "development"}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    // Find active requests that are due soon or overdue
    const activeRequests = await Request.find({
      status: "approved",
      dueDate: { $lte: threeDaysFromNow },
    }).populate("requesterId equipmentId")

    let notificationsCreated = 0

    for (const req of activeRequests) {
      const daysUntilDue = Math.ceil((new Date(req.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Check if notification already exists for this request
      const existingNotification = await Notification.findOne({
        requestId: req._id,
        type: daysUntilDue < 0 ? "overdue-alert" : "due-date-reminder",
      })

      if (!existingNotification) {
        let notificationType = "due-date-reminder"
        let title = "Equipment Due Soon"
        let message = `Your borrowed equipment "${req.equipmentId.name}" is due in ${daysUntilDue} days (${req.dueDate.toLocaleDateString()})`

        if (daysUntilDue < 0) {
          notificationType = "overdue-alert"
          title = "Equipment Overdue!"
          message = `Your borrowed equipment "${req.equipmentId.name}" is overdue by ${Math.abs(daysUntilDue)} days. Please return it immediately.`
        }

        const notification = await Notification.create({
          userId: req.requesterId._id,
          requestId: req._id,
          type: notificationType,
          title,
          message,
          daysUntilDue,
          email: req.requesterId.email,
          emailSent: false,
        })

        notificationsCreated++
      }
    }

    return NextResponse.json({
      success: true,
      notificationsCreated,
      message: `Checked ${activeRequests.length} active requests and created ${notificationsCreated} notifications`,
    })
  } catch (error: any) {
    console.error("[v0] Error checking overdue items:", error.message)
    return NextResponse.json({ message: "Failed to check overdue items" }, { status: 500 })
  }
}
