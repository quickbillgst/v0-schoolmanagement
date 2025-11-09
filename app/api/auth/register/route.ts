import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password, role } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    })

    // Generate token
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
