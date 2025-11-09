import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
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

async function seedData(data: any) {
  try {
    const results = {
      inserted: { users: 0, equipment: 0, requests: 0 },
      skipped: { users: 0, equipment: 0, requests: 0 },
      errors: [] as string[],
    }

    // Seed users
    if (data.users && Array.isArray(data.users)) {
      for (const userData of data.users) {
        try {
          const existingUser = await User.findOne({ email: userData.email })
          if (existingUser) {
            results.skipped.users++
            continue
          }

          // Hash password before saving
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(userData.password, salt)

          const user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || "student",
          })

          await user.save()
          results.inserted.users++
        } catch (error: any) {
          results.errors.push(`User ${userData.email}: ${error.message}`)
        }
      }
    }

    // Get admin user for equipment creation and request approval
    const adminUser = await User.findOne({ role: "admin" })
    if (!adminUser) {
      results.errors.push("No admin user found. Admin must be created first.")
      return results
    }

    // Seed equipment
    const equipmentMap: { [key: string]: any } = {}
    if (data.equipment && Array.isArray(data.equipment)) {
      for (const equipData of data.equipment) {
        try {
          const existingEquipment = await Equipment.findOne({ name: equipData.name })
          if (existingEquipment) {
            equipmentMap[equipData.name] = existingEquipment._id
            results.skipped.equipment++
            continue
          }

          const equipment = new Equipment({
            name: equipData.name,
            category: equipData.category,
            condition: equipData.condition || "good",
            quantity: equipData.quantity,
            availableQuantity: equipData.quantity,
            description: equipData.description || "",
            createdBy: adminUser._id,
            status: equipData.status || "available",
          })

          const savedEquipment = await equipment.save()
          equipmentMap[equipData.name] = savedEquipment._id
          results.inserted.equipment++
        } catch (error: any) {
          results.errors.push(`Equipment ${equipData.name}: ${error.message}`)
        }
      }
    }

    // Seed requests (optional)
    if (data.requests && Array.isArray(data.requests)) {
      for (const requestData of data.requests) {
        try {
          // Find requester by email
          let requester
          if (requestData.requesterEmail) {
            requester = await User.findOne({ email: requestData.requesterEmail })
          } else if (requestData.requesterId) {
            requester = await User.findById(requestData.requesterId)
          }

          if (!requester) {
            results.errors.push(`Request: Requester not found`)
            continue
          }

          // Find equipment by name
          let equipment
          if (requestData.equipmentName) {
            equipment = await Equipment.findOne({ name: requestData.equipmentName })
          } else if (requestData.equipmentId) {
            equipment = await Equipment.findById(requestData.equipmentId)
          }

          if (!equipment) {
            results.errors.push(`Request: Equipment not found`)
            continue
          }

          // Validate due date
          const dueDate = new Date(requestData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
          if (dueDate <= new Date()) {
            results.errors.push(`Request: Due date must be in the future`)
            continue
          }

          const request = new Request({
            requesterId: requester._id,
            equipmentId: equipment._id,
            quantity: requestData.quantity || 1,
            status: requestData.status || "pending",
            dueDate,
            approvedBy: requestData.status === "approved" ? adminUser._id : null,
          })

          await request.save()
          results.inserted.requests++
        } catch (error: any) {
          results.errors.push(`Request: ${error.message}`)
        }
      }
    }

    return results
  } catch (error: any) {
    throw new Error(`Seeding failed: ${error.message}`)
  }
}

async function handler(request: NextRequest) {
  try {
    await connectDB()

    let seedDataPayload = null

    // Check if JSON file was uploaded
    const contentType = request.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      seedDataPayload = await request.json()
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File
      if (file) {
        const text = await file.text()
        seedDataPayload = JSON.parse(text)
      }
    }

    // If no file provided, load default seed data
    if (!seedDataPayload) {
      const response = await fetch(new URL("/seed-data.json", request.url))
      seedDataPayload = await response.json()
    }

    const results = await seedData(seedDataPayload)

    return NextResponse.json({
      success: true,
      message: "Seeding completed",
      data: results,
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
