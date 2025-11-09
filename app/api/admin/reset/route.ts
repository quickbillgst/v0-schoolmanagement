import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { withRole } from "@/middleware/auth"
import User from "@/models/User"
import Equipment from "@/models/Equipment"
import Request from "@/models/Request"

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/school-equipment")
}

async function handler(request: NextRequest) {
  try {
    // Get confirmation query parameter
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get("confirm")

    if (confirm !== "yes") {
      return NextResponse.json(
        {
          success: false,
          message: "Reset cancelled. Confirmation required. Use ?confirm=yes",
        },
        { status: 400 },
      )
    }

    await connectDB()

    // Delete all documents from collections
    await User.deleteMany({})
    await Equipment.deleteMany({})
    await Request.deleteMany({})

    return NextResponse.json({
      success: true,
      message: "Database reset completed. All collections cleared.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export const POST = withRole("admin")(handler)
