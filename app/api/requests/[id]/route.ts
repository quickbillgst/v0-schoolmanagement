import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Request from "@/models/Request"
import Equipment from "@/models/Equipment"
import Notification from "@/models/Notification"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

// PUT - Approve, reject, or mark as returned
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

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ success: false, message: "Please provide status" }, { status: 400 })
    }

    const borrowRequest = await Request.findById(params.id)
    if (!borrowRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 })
    }

    let equipment: any = null

    if (status === "returned") {
      if (borrowRequest.requesterId.toString() !== decoded.id && !["admin", "staff"].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: "You cannot mark this request as returned" },
          { status: 403 },
        )
      }

      borrowRequest.status = "returned"
      borrowRequest.returnDate = new Date()

      equipment = await Equipment.findById(borrowRequest.equipmentId)
      if (equipment) {
        equipment.availableQuantity += borrowRequest.quantity
        await equipment.save()
      }
    } else if (["approved", "rejected"].includes(status)) {
      if (!["admin", "staff"].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, message: "Only admins and staff can approve/reject requests" },
          { status: 403 },
        )
      }

      borrowRequest.status = status
      borrowRequest.approvedBy = decoded.id

      if (status === "approved") {
        equipment = await Equipment.findById(borrowRequest.equipmentId)
        if (equipment) {
          equipment.availableQuantity -= borrowRequest.quantity
          await equipment.save()
        }

        const requester = await Request.findById(params.id).populate("requesterId equipmentId")
        try {
          await Notification.create({
            userId: borrowRequest.requesterId,
            requestId: borrowRequest._id,
            type: "approved",
            title: "Request Approved",
            message: `Your request for "${equipment?.name}" (Qty: ${borrowRequest.quantity}) has been approved. Due date: ${borrowRequest.dueDate.toLocaleDateString()}`,
            email: requester?.requesterId?.email,
            emailSent: false,
          })
        } catch (notificationError) {
          console.error("[v0] Error creating notification:", notificationError)
          // Continue even if notification creation fails
        }
      } else if (status === "rejected") {
        const requester = await Request.findById(params.id).populate("requesterId equipmentId")
        try {
          await Notification.create({
            userId: borrowRequest.requesterId,
            requestId: borrowRequest._id,
            type: "rejected",
            title: "Request Rejected",
            message: `Your request for "${equipment?.name}" has been rejected.`,
            email: requester?.requesterId?.email,
            emailSent: false,
          })
        } catch (notificationError) {
          console.error("[v0] Error creating notification:", notificationError)
          // Continue even if notification creation fails
        }
      }
    }

    await borrowRequest.save()

    const updatedRequest = await Request.findById(borrowRequest._id)
      .populate("requesterId", "name email")
      .populate("equipmentId", "name category")
      .populate("approvedBy", "name email")

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
